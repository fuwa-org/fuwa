#!/bin/sh
prs="$(gh pr list --state open --app dependabot --json number -q ".[].number")"

data="$(gh pr list --state open --app dependabot --json number,state,isDraft,title,headRefName)"

for pr in $prs; do
  echo debug: processing PR $pr
  if echo "$data" | jq -r ".[] | select(.number == $pr).isDraft" | grep -q true; then
    echo debug: skipping draft PR $pr
    continue
  fi

  bash scripts/update_pnpm.sh "{\"number\":$pr,\"headRefName\":\"$(echo "$data" | jq -r ".[] | select(.number == $pr).headRefName")\"}"

  echo debug: merging \"$(echo "$data" | jq -r ".[] | select(.number == $pr).title")\"

  gh pr merge $pr --squash --auto
done

echo debug: done
