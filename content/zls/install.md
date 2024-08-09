---
{
    .title = "ZLS Installation Guide",
    .date = @date("2020-07-06T00:00:00"),
    .author = "Sample Author",
    .draft = false,
    .layout = "zls-install.shtml",
    .tags = [],
} 
---

## Install Editor Extension

<!-- TODO: individualy document for each editor-extension whether they can find Zig or ZLS in $PATH -->

> Many editor extensions can find Zig and ZLS automatically by adding them to your `PATH`.

<!-- `name` attribute on `<details>`:  https://caniuse.com/mdn-html_elements_details_name -->
<details name="editor-extensions">
  <summary>

### Visual Studio Code

  </summary>

Using ZLS in VS Code is as simple as installing the [official Zig Language extension](https://marketplace.visualstudio.com/items?itemName=ziglang.vscode-zig).
([open in VSCode](vscode:extension/ziglang.vscode-zig), [open in VSCodium](vscodium:extension/ziglang.vscode-zig))

</details> <!-- Visual Studio Code -->

<details name="editor-extensions">
  <summary>

<h3 id="sublime-text">Sublime Text</h3> <!-- linked from "In-Editor Configuration" -->

  </summary>
  
1. install the [LSP](https://github.com/sublimelsp/LSP) and [sublime-zig-language](https://github.com/ziglang/sublime-zig-language) package ([Package Control Usage](https://packagecontrol.io/docs/usage))
2. place the following snippet in the `LSP.sublime-settings` (Preferences -> Package Settings -> LSP -> Settings)
3. place the following snippet in the `Zig.sublime-settings` (Preferences -> Package Settings -> Zig -> Settings)

<details>
<summary>

  show **Zig.sublime-settings**

</summary>

```json
// Zig.sublime-settings
{
  // ZLS will run format on save
  "zig.fmt.on_save": false,
  // automatically hide the build/fmt output panel
  "zig.quiet": true
}
```

</details> <!-- show Zig.sublime-settings -->

#### Sublime Text 4

<details>
<summary>

  show **LSP.sublime-settings**

</summary>

```json
// LSP.sublime-settings
{
  // General settings
  // Keep in mind that these settings apply to any language and not just Zig.

  // ZLS uses `zig fmt` as the formatter.
  // The Zig FAQ answers some questions about `zig fmt`:
  // https://github.com/ziglang/zig/wiki/FAQ
  "lsp_format_on_save": true,
  "lsp_code_actions_on_save": {
    // Enable code actions that currently supports adding and removing discards.
    "source.fixAll": true
  },
  // Show inlay hints in the editor. Inlay hints are short annotations within the code,
  // which show variable types or parameter names.
  "show_inlay_hints": true,
  "semantic_highlighting": true,

  "clients": {
    "zig": {
      // Enable or disable this client configuration.
      "enabled": true,
      // The command line required to run the server.
      "command": ["/path/to/zls_executable"],
      "selector": "source.zig",
      // There are two ways to set config options:
      //   - edit your `zls.json` that applies to any editor that uses ZLS
      //   - set in-editor config options with the `settings` field below.
      //
      // Further information on how to configure ZLS:
      // https://github.com/zigtools/zls/wiki/Configuration
      "settings": {
        // Whether to enable build-on-save diagnostics
        // "enable_build_on_save": true,

        // omit the following line if `zig` is in your PATH
        "zig_exe_path": "/path/to/zig_executable"
      }
    }
  }
}
```

</details> <!-- show LSP.sublime-settings -->

#### Sublime Text 3

<details>
<summary>

  show **LSP.sublime-settings**

</summary>

```json
// LSP.sublime-settings
{
  "clients": {
    "zig": {
      "command": ["/path/to/zls_executable"],
      "enabled": true,
      "languageId": "zig",
      "scopes": ["source.zig"],
      "syntaxes": ["Packages/Zig Language/Syntaxes/Zig.tmLanguage"]
    }
  }
}
```

</details> <!-- show LSP.sublime-settings -->

</details> <!-- Sublime Text -->

<details name="editor-extensions">
  <summary>

### CLion / other JetBrains IDEs

  </summary>

- Install the [ZigBrains](https://plugins.jetbrains.com/plugin/22456-zigbrains) plugin from the marketplace
- Restart the IDE (necessary for the plugin to integrate itself correctly)

If you have both `zig` and `zls` on $PATH, then the plugin should automatically detect both.

If not, Go to `Settings` -> `Languages & Frameworks` -> `Zig`, and point the `Toolchain Location` and `ZLS path` to the zig compiler's directory and the ZLS executable, respectively.

If everything is set up correctly, an LSP status indicator should appear in the bottom right corner and turn to green when you open a .zig file in the editor.

</details> <!-- CLion / other JetBrains IDE -->

<details name="editor-extensions">
  <summary>

<h3 id="helix">Helix</h3> <!-- linked from "In-Editor Configuration" -->

  </summary>

If `zls` and `zig` are in your `PATH`, everything should work out of the box.

To apply in-editor configuration or manually specify paths to `zls` or `zig`, open `<config_dir>/helix/languages.toml` and add the following:

<details>

<summary>

  show **languages.toml**

</summary>

```toml
[language-server.zls]
# omit the following line if `zls` is in your PATH
command = "/path/to/zls_executable"
# There are two ways to set config options:
#   - edit your `zls.json` that applies to any editor that uses ZLS
#   - set in-editor config options with the `config.<name>` fields below.
#
# Further information on how to configure ZLS:
# https://github.com/zigtools/zls/wiki/Configuration

# Whether to enable build-on-save diagnostics
# config.enable_build_on_save = true
# omit the following line if `zig` is in your PATH
config.zig_exe_path = "/path/to/zig_executable"
```

</details> <!-- show languages.toml -->

Further information on [languages.toml files](https://docs.helix-editor.com/languages.html#languagestoml-files)

To make sure that Zig and ZLS are set up as expected you should run the Helix health check:

```
hx --health zig
```

For more information on the health check results refer to [Health check](https://github.com/helix-editor/helix/wiki/Healthcheck).

</details> <!-- Helix -->

<details name="editor-extensions">
  <summary>

### Neovim / Vim8

  </summary>

<blockquote class="banner-warning">

The [mason](https://github.com/williamboman/mason.nvim) package manager can only install the latest tagged release of ZLS which should **not** be used with Zig master.
Do **not** use ZLS from mason with Zig master.

</blockquote>

<details name="vim-extensions">
  <summary>

<h4 id="nvim-lspconfig">nvim-lspconfig</h4> <!-- linked from "In-Editor Configuration" -->

  </summary>

The following two configs **only** contain the necessary ZLS specific configuration. Please refer to [nvim-lspconfig](https://github.com/neovim/nvim-lspconfig) on how to setup everything else like [keybindings](https://github.com/neovim/nvim-lspconfig?tab=readme-ov-file#suggested-configuration) or [autocompletion](https://github.com/neovim/nvim-lspconfig/wiki/Autocompletion).

Install the [vim-plug](https://github.com/junegunn/vim-plug) plugin manager.

<details>

<summary>

##### `init.lua` with vim-plug

</summary>

```lua
local vim = vim
local Plug = vim.fn['plug#']

vim.call('plug#begin')
  Plug('neovim/nvim-lspconfig') -- https://github.com/neovim/nvim-lspconfig
  Plug('ziglang/zig.vim')       -- https://github.com/ziglang/zig.vim
vim.call('plug#end')

-- don't show parse errors in a separate window
vim.g.zig_fmt_parse_errors = 0
-- disable format-on-save from `ziglang/zig.vim`
vim.g.zig_fmt_autosave = 0
-- enable  format-on-save from nvim-lspconfig + ZLS
--
-- ZLS uses `zig fmt` as the formatter.
-- The Zig FAQ answers some questions about `zig fmt`:
-- https://github.com/ziglang/zig/wiki/FAQ
vim.cmd [[autocmd BufWritePre *.zig lua vim.lsp.buf.format()]]

local lspconfig = require('lspconfig')
lspconfig.zls.setup {
  -- Server-specific settings. See `:help lspconfig-setup`

  -- omit the following line if `zls` is in your PATH
  cmd = { '/path/to/zls_executable' },
  -- There are two ways to set config options:
  --   - edit your `zls.json` that applies to any editor that uses ZLS
  --   - set in-editor config options with the `settings` field below.
  --
  -- Further information on how to configure ZLS:
  -- https://github.com/zigtools/zls/wiki/Configuration
  settings = {
    zls = {
      -- omit the following line if `zig` is in your PATH
      zig_exe_path = '/path/to/zig_executable',
    }
  }
}
```

</details> <!-- show config -->

<details>

<summary>

##### `init.vim` with vim-plug

</summary>

```
call plug#begin('~/.config/nvim/plugged')
  Plug 'neovim/nvim-lspconfig' " https://github.com/neovim/nvim-lspconfig
  Plug 'ziglang/zig.vim'       " https://github.com/ziglang/zig.vim
call plug#end()

-- disable format-on-save from `ziglang/zig.vim`
let g:zig_fmt_autosave = 0
-- don't show parse errors in a separate window
let g:zig_fmt_parse_errors = 0

:lua << EOF
  -- enable format-on-save from nvim-lspconfig + ZLS
  --
  -- ZLS uses `zig fmt` as the formatter.
  -- The Zig FAQ answers some questions about `zig fmt`:
  -- https://github.com/ziglang/zig/wiki/FAQ
  vim.cmd [[autocmd BufWritePre *.zig lua vim.lsp.buf.format()]]

  local lspconfig = require('lspconfig')
  lspconfig.zls.setup {
    -- Server-specific settings. See `:help lspconfig-setup`

    -- omit the following line if `zls` is in your PATH
    cmd = { '/path/to/zls_executable' },
    -- There are two ways to set config options:
    --   - edit your `zls.json` that applies to any editor that uses ZLS
    --   - set in-editor config options with the `settings` field below.
    --
    -- Further information on how to configure ZLS:
    -- https://github.com/zigtools/zls/wiki/Configuration
    settings = {
      zls = {
        -- omit the following line if `zig` is in your PATH
        zig_exe_path = '/path/to/zig_executable',
      }
    }
  }
EOF
```

</details> <!-- show config -->

</details> <!-- nvim-lspconfig -->

<details name="vim-extensions">
  <summary>
  
#### CoC
  
  </summary>

Add ZLS in your `coc-settings.json` (open it using `:CocConfig`) like this:

```json
{
  // Show inlay hints in the editor. Inlay hints are short annotations within the code,
  // which show variable types or parameter names.
  "inlayHint.enable": true,
  "semanticTokens.enable": true,

  "languageserver": {
    "zls": {
      "command": "zls",
      "filetypes": [ "zig", "zon" ]
    }
  }
}
```

</details> <!-- CoC -->

<details name="vim-extensions">
  <summary>

#### YouCompleteMe

  </summary>

- Install YouCompleteMe from [here](https://github.com/ycm-core/YouCompleteMe.git).
- Add these lines to your vimrc:

```
"ensure zig is a recognized filetype
autocmd BufNewFile,BufRead *.zig set filetype=zig
let g:ycm_language_server =
    \\ [
    \\{
    \\     'name': 'zls',
    \\     'filetypes': [ 'zig' ],
    \\     'cmdline': [ '/path/to/zls_executable' ]
    \\    }
    \\ ]
```

</details> <!-- YouCompleteMe -->

<details name="vim-extensions">
  <summary>

#### LanguageClient-neovim

  </summary>

- Install the LanguageClient-neovim from [here](https://github.com/autozimu/LanguageClient-neovim).
- Edit your neovim configuration and add `zls` for zig filetypes:

```
let g:LanguageClient_serverCommands = {
        \\ 'zig': ['/path/to/zls_executable'],
        \\ }
```

</details> <!-- LanguageClient-neovim -->

</details>

<details name="editor-extensions">
  <summary>

### Emacs

  </summary>

- Use the inbuilt eglot mode. Make sure ZLS is in your path.
- [zig mode](https://github.com/ziglang/zig-mode) is also useful.

Use `M-x eglot` in a zig-mode buffer to start the server.

</details>

<details name="editor-extensions">
  <summary>

### Doom Emacs

  </summary>

- Enable `:tools lsp` module.
- Enable `:lang (zig +lsp)` module.
- Run `doom sync` in a terminal.

</details> <!-- Doom Emacs -->

<details name="editor-extensions">
  <summary>

### Spacemacs

  </summary>

- Add `lsp` and `zig` to `dotspacemacs-configuration-layers` in your `.spacemacs` file.
- If you don't have `zls` in your `PATH`, add the following to `dotspacemacs/user-config` in your `.spacemacs` file:

```
(setq lsp-zig-zls-executable "/path/to/zls_executable")
```

</details> <!-- Spacemacs -->

<details name="editor-extensions">
  <summary>

### Kate

  </summary>

Kate has builtin support for Zig and automatically asks you to enable ZLS if if is found in your `$PATH`.

You can enable some LSP related settings like "Inlay Hints" or "Format on Save" under `Settings -> LSP Client -> Client Settings`

If you wish to manually specify the path to the ZLS executable, open `Settings -> LSP Client -> User Server Settings` and add the following snippet:

```json
{
  "servers": {
    "zig": {
      "command": ["/path/to/zls_executable"],
      "url": "https://github.com/zigtools/zls",
      "highlightingModeRegex": "^Zig$"
    }
  }
}
```

</details> <!-- Kate -->

## Configuration

> ZLS works well without any configuration, all config options have reasonable defaults. Feel free to read through the available config options but unless there is something you want to change, there is no need to configure ZLS.

<details name="configuration">
  <summary>

### In-Editor Configuration (recommended)

  </summary>

In-Editor Config (or Workspace Config) will integrate with the config system of you editor to configure ZLS on a per-editor basis. 

Some editors (like VS Code) also allow workspace-specific configuration. If you want to share the same configuration across multiple editors, please refer to the _zls.json_ alternative.

This feature is available for the following editors:

- [VS Code](https://marketplace.visualstudio.com/items?itemName=ziglang.vscode-zig)
- [Sublime Text](#sublime-text)
- [Helix](#helix)
- [Neovim with nvim-lspconfig](#nvim-lspconfig)


</details> <!-- In-Editor Configuration -->

<details name="configuration">
  <summary>

### zls.json

  </summary>

You can configure ZLS by creating a zls.json configuration file. This config will apply to **all** editors that use ZLS.

Here is an example of how a zls.json _could_ look like:

```json
{
  "zig_exe_path": "/path/to/zig_executable",
  "semantic_tokens": "partial",
  "enable_build_on_save": true
}
```

The file must be valid JSON which cannot contain comments or trailing commas.

<details>
  <summary>

#### Available Configuration Options

  </summary>

You can find all available config options by looking at [src/Config.zig](https://github.com/zigtools/zls/blob/master/src/Config.zig) or the [JSON Schema](https://github.com/zigtools/zls/blob/master/schema.json).

</details> <!-- Available Configuration Options -->

<details>
  <summary>

#### Where should the zls.json be created?

  </summary>

##### ZLS since 0.14.0-dev.50+3354fdcb

Running `zls env` will show you where ZLS will look for the zls.json file:

```json
{
  "version": "0.14.0-dev.50+3354fdcb",
  "global_cache_dir": "/home/anon/.cache/zls",
  "global_config_dir": "/etc/xdg",
  "local_config_dir": "/home/anon/.config",
  "config_file": null,
  "log_file": "/home/anon/.cache/zls/zls.log"
}
```

ZLS will look for a `zls.json` in the `local_config_dir` directory and then fallback to `global_config_dir`.

After creating the configuration file at `$local_config_dir/zls.json`, `zls env` should output the following:

```json
{
  "version": "0.14.0-dev.50+3354fdcb",
  "global_cache_dir": "/home/anon/.cache/zls",
  "global_config_dir": "/etc/xdg",
  "local_config_dir": "/home/anon/.config",
  "config_file": "/home/anon/.config/zls.json",
  "log_file": "/home/anon/.cache/zls/zls.log"
}
```

##### ZLS before 0.14.0-dev.50+3354fdcb

Running `zls --show-config-path` will show a path to an already existing zls.json or a path to the local configuration folder instead.

```
> zls --show-config-path
info  ( main ): No config file zls.json found.
info  ( main ): A path to the local configuration folder will be printed instead.
/home/anon/.config/zls.json
```

</details> <!-- Where should the zls.json be created? -->

</details> <!-- zls.json -->

<details name="configuration">
  <summary>

### Per-build Configuration (advanced)

  </summary>

The following options can be set on a per-project basis by placing `zls.build.json` in the project root directory next to `build.zig`.

| Option                  | Type             | Default value | What it Does                                                                                                                                              |
| ----------------------- | ---------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `relative_builtin_path` | `?[]const u8`    | `null`        | If present, this path is used to resolve `@import("builtin")`                                                                                             |
| `build_options`         | `?[]BuildOption` | `null`        | If present, this contains a list of user options to pass to the build. This is useful when options are used to conditionally add packages in `build.zig`. |

#### `BuildOption`

`BuildOption` is defined as follows:

```zig
const BuildOption = struct {
    name: []const u8,
    value: ?[]const u8 = null,
};
```

When `value` is present, the option will be passed the same as in `zig build -Dname=value`. When `value` is `null`, the option will be passed as a flag instead as in `zig build -Dflag`.

</details> <!-- Per-build Configuration -->
