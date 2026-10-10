#!/usr/bin/env bash
# 对 PR 增量文件执行 eslint（与根 lint-staged 规则一致：--max-warnings=0）
# 用法: lint-increment.sh <base-ref>
# 结果摘要写入 lint-report.md，同时追加到 $GITHUB_STEP_SUMMARY（若存在）
set -uo pipefail

BASE_REF="${1:?用法: lint-increment.sh <base-ref>}"
REPORT="lint-report.md"

git fetch --no-tags origin \
  "+refs/heads/${BASE_REF#origin/}:refs/remotes/origin/${BASE_REF#origin/}" 2>/dev/null || true
BASE="$(git merge-base "$BASE_REF" HEAD)"
echo "基线提交: $BASE ($(git log -1 --format='%s' "$BASE"))"

# 基线以来新增/修改的可 lint 文件（本仓文件名不含空格，直接分词）
CHANGED="$(git diff --diff-filter=ACMR --name-only "$BASE" HEAD \
  | grep -E '\.(js|mjs|cjs|ts|vue)$' \
  | grep -vE '(^|/)(dist|node_modules|coverage)/' || true)"

if [ -z "$CHANGED" ]; then
  echo "本次提交没有涉及需要 lint 的增量文件。" | tee "$REPORT"
  [ -n "${GITHUB_STEP_SUMMARY:-}" ] && cat "$REPORT" >> "$GITHUB_STEP_SUMMARY"
  exit 0
fi

# 向上寻找离文件最近的 eslint flat config，确定其配置根
config_root() {
  local d
  d="$(dirname "$1")"
  while [ "$d" != "." ] && [ "$d" != "/" ] \
    && [ ! -f "$d/eslint.config.mjs" ] && [ ! -f "$d/eslint.config.js" ]; do
    d="$(dirname "$d")"
  done
  if [ -f "$d/eslint.config.mjs" ] || [ -f "$d/eslint.config.js" ]; then
    printf '%s' "$d"
  else
    printf '%s' "."
  fi
}

ROOTS=""
for f in $CHANGED; do
  r="$(config_root "$f")"
  case " $ROOTS " in
    *" $r "*) ;;
    *) ROOTS="$ROOTS $r" ;;
  esac
done

FAILED=0
: > "$REPORT"
for r in $ROOTS; do
  FILES=""
  for f in $CHANGED; do
    if [ "$(config_root "$f")" = "$r" ]; then
      rel="$f"
      [ "$r" != "." ] && rel="${f#"$r"/}"
      FILES="$FILES $rel"
    fi
  done
  COUNT=0
  for _ in $FILES; do COUNT=$((COUNT + 1)); done
  echo "==> lint ${r}（${COUNT} 个文件）:${FILES}"
  if (cd "$r" && npx eslint --max-warnings=0 $FILES); then
    echo "- ✅ \`${r}\`：${COUNT} 个文件全部通过" >> "$REPORT"
  else
    echo "- ❌ \`${r}\`：${COUNT} 个文件未通过（详见上方日志）" >> "$REPORT"
    FAILED=1
  fi
done

echo "" >> "$REPORT"
if [ "$FAILED" -eq 0 ]; then
  echo "**结果：全部通过 ✅**" >> "$REPORT"
else
  echo "**结果：存在未通过的目录，请查看日志详情 ❌**" >> "$REPORT"
fi
[ -n "${GITHUB_STEP_SUMMARY:-}" ] && cat "$REPORT" >> "$GITHUB_STEP_SUMMARY"
exit $FAILED
