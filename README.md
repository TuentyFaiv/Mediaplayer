# Media player by TuentyFaiv
This is a media player built with web components, typescript and sass, to work in any framework or library of javascript.

## Install
```npm
npm i @tuentyfaiv/mediaplayer
```
## Usage
```javascript
import '@tuentyfaiv/mediaplayer';
```

```html
<tf-player
  src=""
  poster=""
  bg=""
  titleText=""
  w=""
  h=""
  share=""
>
</tf-player>
```

| Attribute | Description |
| ----------| ----------- |
| src       | Sets the video source. |
| poster    | Sets the video poster. (Optional) |
| bg        | Sets the video background color. (Optional, default is "#040305") |
| titleText | Sets video title (Optional) |
| w         | Video width. (Optional, default is "100%") |
| h         | Video height. (Optional, default is "540px") |
| share     | Disable the option to share the video page, the only option is "false". (Optional, the option to share the video page by default is active) |

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

## Contributing (coming soon)
If someone wants to add or improve something, I invite you to collaborate directly in this repository: [TuentyFaiv/Mediaplayer](https://github.com/TuentyFaiv/Mediaplayer) 

# License
@tuentyfaiv/mediaplayer is released under the [MIT License](https://opensource.org/licenses/MIT).