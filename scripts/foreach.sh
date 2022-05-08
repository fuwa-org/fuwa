workspaces=$(ls packages/)

echo ":: running '$@' in all packages"

for x in $workspaces; do
  echo ":: in workspace $x"
  cd "packages/$x"
  eval $@
  cd - > /dev/null
done

echo ":: done"
