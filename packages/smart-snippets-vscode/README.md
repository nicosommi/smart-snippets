# smart-snippets-vscode
Smart snippet support on vscode

##Configuration

## Features

WIP - TBD:

\!\[feature X\]\(images/feature-x.png\)

> Tip: TBD

## Extension Settings
This extension contributes the following settings:

* `smartSnippets.workspace`: this is the path in which archetypes are going to be saved. If `${workspaceRoot}` is found on the string, it will be replaced by the workspace dir, but it can also be an absolute path.
Example:
```
"smartSnippets": {
  "workspace": "${workspaceRoot}/.ss"
}
```

## Release Notes
### 0.0.1
- Support smart snippet update regions and save to workspace
- Support workspace setting and on it `${workspaceRoot}`. Defaults to os.homedir
- Shows messages with success / error status