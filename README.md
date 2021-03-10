# Media player by TuentyFaiv
This is a media player built with web components, typescript and sass, to work in any framework or library of javascript.

## Install
```npm
npm install @tuentyfaiv/mediaplayer
```
## Usage
```javascript
import '@tuentyfaiv/mediaplayer';
```

```html
<tf-player
  player_src=""
  player_poster=""
  player_share=""
  player_title=""
  player_width=""
  player_height=""
  player_background=""
>
</tf-player>
```

| Attribute         | Description |
| ----------------- | ----------- |
| player_src        | Sets the video source. |
| player_poster     | Sets the video poster. (Optional) |
| player_share      | Disable the option to share the video page, the only option is "false". (Optional, the option to share the video page by default is active) |
| player_title      | Sets video title (Optional) |
| player_width      | Video width. (Optional, default is "100%") |
| player_height     | Video height. (Optional, default is "540px") |
| player_background | Sets the video background color. (Optional, default is "#040305") |

**All attribute values ​​must be of type string**

## Features
| Keyboard key| Action(s) |
| ----------- | ----------- |
| Spacebar    | Play, Pause, Replay |
| Arrow up    | Volume up |
| Arrow down  | Volume down |
| Arrow left  | Backward 10s |
| Arrow right | Forward 10s |
| m           | Toggle mute  |
| p           | Picture in picture (only if supported by the browser) |
| t           | Toggle theater mode |
| f           | Toggle fullscreen mode |
| esc         | Exit fullscreen |

## Contributing
If someone wants to add or improve something, I invite you to collaborate directly in this repository: **[TuentyFaiv/Mediaplayer](https://github.com/TuentyFaiv/Mediaplayer)**

## License
@tuentyfaiv/mediaplayer is released under the [MIT License](https://opensource.org/licenses/MIT).