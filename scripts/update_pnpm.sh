#!/bin/sh
prs="${1:-"gh pr list --state open --app dependabot --json number,headRefName"}"

for pr in $(echo "$prs" | jq ".[].number"); do
  echo debug: processing PR $pr
  if echo "$data" | jq -r ".[] | select(.number == $pr).isDraft" | grep -q true; then
    echo debug: skipping draft PR $pr
    continue
  fi

  echo debug: checking out 
  gh pr checkout $pr 

  echo debug: installing dependencies 
  pnpm install 

  echo debug: running tests
  yarn build && yarn lint 

  if [ $? -eq 0 ]; then
    echo info: PR $pr passed tests after lockfile update 
    gh pr comment $pr ":white_check_mark: PR passed tests after lockfile update" 
    git add pnpm-lock.yaml 
    git commit -m "chore: lockfile update"
    git push -u origin "$(echo "$prs" | jq -r ".[] | select(.number == $pr).headRefName")"
  else
    echo debug: dep update failed
  fi
done

echo debug: done
