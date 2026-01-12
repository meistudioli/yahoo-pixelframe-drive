# yahoo-pixelframe-drive

[![DeepScan grade](https://deepscan.io/api/teams/16372/projects/30257/branches/970140/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=16372&pid=30257&bid=970140)

&lt;yahoo-pixelframe-drive /> is a video library. It combine several web components and bring add / edit / delete / search features together.

Users could picked video files through the following methods.

- pick from file picker window.
- drag & drop files into drop zone
- direct copy / paste files which from file system or web page.

![<yahoo-pixelframe-drive />](https://blog.lalacube.com/mei/img/preview/yahoo-pixelframe-drive.png)

## Basic Usage

&lt;yahoo-pixelframe-drive /> is a web component. All we need to do is put the required script into your HTML document. Then follow &lt;yahoo-pixelframe-drive />'s html structure and everything will be all set.

- Required Script

```html
<script 
  type="module"
  src="https://unpkg.com/yahoo-pixelframe-drive/mjs/wc-yahoo-pixelframe-drive.js">
</script>
```

- Structure

Put &lt;yahoo-pixelframe-drive /> into HTML document.

```html
<yahoo-pixelframe-drive>
  <script type="application/json">
    {
      "maxpickcount": 1,
      "maxuploadcount": 100,
      "placeholder": "Search video",
      "uploader": {
        "multiple": true,
        "accept": ".mov,.mp4,.ogg,.webm",
        "imagelimitation": {
          "minwidth": 100,
          "minheight": 100,
          "size": 52428800
        },
        "videolimitation": {
          "minwidth": 100,
          "minheight": 100,
          "size": 314572800,
          "duration": 3600
        },
        "maximagecount": 0,
        "maxvideocount": 20,
        "webservice": {
          "token": {
            "url": "https://trendr-apac.media.yahoo.com/api/pixelframe/v1/aws/resources/s3/credentials?role=content-upload"
          },
          "upload": {
            "urls": {
              "video": "https://trendr-apac.media.yahoo.com/api/pixelframe/v1/videos/upload",
              "image": "https://trendr-apac.media.yahoo.com/api/pixelframe/v1/images/upload"
            },
            "params": {
              "targetType": "videolibrary",
              "targetId": "auction2",
              "appName": "auction",
              "resizingProfile": "auction",
              "transcodingProfile": "auction"
            }
          }
        }
      },
      "webservice": {
        "listings": "https://canary-reeldeal.ec.yahoo.com:4443/api/reeldeal/v1/me/videos?status=ACTIVE",
        "create": "https://canary-reeldeal.ec.yahoo.com:4443/api/reeldeal/v1/videos",
        "edit": "https://canary-reeldeal.ec.yahoo.com:4443/api/reeldeal/v1/videos/{{videoId}}",
        "delete": "https://canary-reeldeal.ec.yahoo.com:4443/api/reeldeal/v1/videos/{{videoId}}"
      }
    }
  </script>
</yahoo-pixelframe-drive>
```

Otherwise, developers could also choose remoteconfig to fetch config for &lt;yahoo-pixelframe-drive />.

```html
<yahoo-pixelframe-drive
  remoteconfig="https://your-domain/api-path"
>
  ...
  ...
  ...
</yahoo-x-bv-player>
```

## JavaScript Instantiation

&lt;yahoo-pixelframe-drive /> could also use JavaScript to create DOM element. Here comes some examples.

```html
<script type="module">
import { YahooPixelframeDrive } from 'https://unpkg.com/yahoo-pixelframe-drive/mjs/wc-yahoo-pixelframe-drive.js';

//use DOM api
const nodeA = document.createElement('yahoo-pixelframe-drive');
document.body.appendChild(nodeA);
nodeA.placeholder = 'Search Video';

// new instance with Class
const nodeB = new YahooPixelframeDrive();
document.body.appendChild(nodeB);
nodeB.maxpickcount = 3;

// new instance with Class & default config
const config = {
  "maxpickcount": 1,
  "maxuploadcount": 100,
  "placeholder": "Search video",
  "uploader": {
    "multiple": true,
    "accept": ".mov,.mp4,.ogg,.webm",
    "imagelimitation": {
      "minwidth": 100,
      "minheight": 100,
      "size": 52428800
    },
    "videolimitation": {
      "minwidth": 100,
      "minheight": 100,
      "size": 314572800,
      "duration": 3600
    },
    "maximagecount": 0,
    "maxvideocount": 20,
    "webservice": {
      "token": {
        "url": "https://trendr-apac.media.yahoo.com/api/pixelframe/v1/aws/resources/s3/credentials?role=content-upload"
      },
      "upload": {
        "urls": {
          "video": "https://trendr-apac.media.yahoo.com/api/pixelframe/v1/videos/upload",
          "image": "https://trendr-apac.media.yahoo.com/api/pixelframe/v1/images/upload"
        },
        "params": {
          "targetType": "videolibrary",
          "targetId": "auction2",
          "appName": "auction",
          "resizingProfile": "auction",
          "transcodingProfile": "auction"
        }
      }
    }
  },
  "webservice": {
    "listings": "https://canary-reeldeal.ec.yahoo.com:4443/api/reeldeal/v1/me/videos?status=ACTIVE",
    "create": "https://canary-reeldeal.ec.yahoo.com:4443/api/reeldeal/v1/videos",
    "edit": "https://canary-reeldeal.ec.yahoo.com:4443/api/reeldeal/v1/videos/{{videoId}}",
    "delete": "https://canary-reeldeal.ec.yahoo.com:4443/api/reeldeal/v1/videos/{{videoId}}"
  }
};

const nodeC = new YahooPixelframeDrive(config);
document.body.appendChild(nodeC);
</script>
```

## Style Customization

Developers could apply styles to decorate &lt;yahoo-pixelframe-drive />'s looking.

```html
<style>
yahoo-pixelframe-drive {
  /* common */
  --yahoo-pixelframe-drive-dialog-background-color: rgba(255 255 255);
  --yahoo-pixelframe-drive-dialog-title-color: rgba(70 78 86);
  --yahoo-pixelframe-drive-dialog-title-border-color: rgba(130 138 147);
  --yahoo-pixelframe-drive-hr-color: rgba(224 228 233);
  --yahoo-pixelframe-drive-action-button-accent-color: rgba(15 105 255);
  --yahoo-pixelframe-drive-action-button-inert-color: rgba(176 185 193);

  --yahoo-pixelframe-drive-drag-n-drop-hint: 'Drop video(s) here.';
  --yahoo-pixelframe-drive-drag-n-drop-hint-text-color: rgba(255 255 255);
  --yahoo-pixelframe-drive-drag-n-drop-hint-overlay-color: rgba(0 0 0/.8);

  /* dialog > drive */
  --yahoo-pixelframe-drive-drive-inline-size: 800px;
  --yahoo-pixelframe-drive-drive-title: 'Video Library';
  --yahoo-pixelframe-drive-drive-add-button-icon-color: rgba(230 50 89);
  --yahoo-pixelframe-drive-drive-add-button-icon-inert-color: rgba(176 185 193);
  --yahoo-pixelframe-drive-drive-add-button-active-background-color: rgba(242 242 242);
  --yahoo-pixelframe-drive-drive-search-normal-background-color: rgba(240 243 245);
  --yahoo-pixelframe-drive-drive-search-active-background-color: rgba(224 228 233);
  --yahoo-pixelframe-drive-drive-search-input-color: rgba(35 42 49);
  --yahoo-pixelframe-drive-drive-search-input-placeholder-color: rgba(151 158 168);
  --yahoo-pixelframe-drive-drive-search-icon-color: rgba(35 42 49);
  --yahoo-pixelframe-drive-drive-search-border-color: rgba(199 205 210);
  --yahoo-pixelframe-drive-drive-no-result-text: 'No video exists.';
  --yahoo-pixelframe-drive-drive-no-result-text-color: rgba(70 78 86);
  --yahoo-pixelframe-drive-drive-listing-border-color: rgba(224 228 233);
  --yahoo-pixelframe-drive-drive-listing-overlay-background: rgba(255 255 255/.35);
  --yahoo-pixelframe-drive-drive-pick-info-text-color: rgba(35 42 49);
  --yahoo-pixelframe-drive-drive-button-confirm-text: 'CONFIRM';

  /* dialog > edit */
  --yahoo-pixelframe-drive-edit-title: 'Edit Video';
  --yahoo-pixelframe-drive-edit-button-confirm-text: 'CONFIRM';
  --yahoo-pixelframe-drive-edit-button-cancel-text: 'CANCEL';
  --yahoo-pixelframe-drive-edit-input-background-color: rgba(255 255 255);
  --yahoo-pixelframe-drive-edit-input-text-color: rgba(35 42 49);
  --yahoo-pixelframe-drive-edit-input-border-color: rgba(110 119 128);
  --yahoo-pixelframe-drive-edit-input-placeholder-color: rgba(70 78 86);
  --yahoo-pixelframe-drive-edit-input-label-text-color: rgba(110 119 128);
  --yahoo-pixelframe-drive-edit-input-theme-color: rgba(15 105 255);
  
  /* dialog > delete */
  --yahoo-pixelframe-drive-delete-title: 'Delete Video';
  --yahoo-pixelframe-drive-delete-title-text-color: rgba(35 42 49);
  --yahoo-pixelframe-drive-delete-description-text-color: rgba(176 185 193);
  --yahoo-pixelframe-drive-delete-button-confirm-text: 'DELETE';
  --yahoo-pixelframe-drive-delete-button-cancel-text: 'CANCEL';
}
</style>
```

## Attributes

&lt;yahoo-pixelframe-drive /> supports some attributes to let it become more convenience & useful.

- **maxpickcount**

Set max pick count. User could pick videos which under this value.

```html
<yahoo-pixelframe-drive maxpickcount="1">
  ...
</yahoo-pixelframe-drive>
```

<hr />

- **maxuploadcount**

Set max upload count. Video library's video count can not exceed this value.

```html
<yahoo-pixelframe-drive maxuploadcount="100">
  ...
</yahoo-pixelframe-drive>
```

<hr />

- **placeholder**

Set search field's placehoder.

```html
<yahoo-pixelframe-drive placeholder="Search video">
  ...
</yahoo-pixelframe-drive>
```

<hr />

- **uploader**

Set uploader config. &lt;yahoo-pixelframe-drive /> applied [&lt;yahoo-pixelframe-uploader />](https://github.com/meistudioli/yahoo-pixelframe-uploader) for uploading video files. Developers should check document and put JSON string as value.

```html
<yahoo-pixelframe-drive uploader='{"multiple":true,"accept":".mov,.mp4,.ogg,.webm","imagelimitation":{"minwidth":100,"minheight":100,"size":52428800},"videolimitation":{"minwidth":100,"minheight":100,"size":314572800,"duration":3600},"maximagecount":0,"maxvideocount":20,"webservice":{"token":{"url":"https://trendr-apac.media.yahoo.com/api/pixelframe/v1/aws/resources/s3/credentials?role=content-upload"},"upload":{"urls":{"video":"https://trendr-apac.media.yahoo.com/api/pixelframe/v1/videos/upload","image":"https://trendr-apac.media.yahoo.com/api/pixelframe/v1/images/upload"},"params":{"targetType":"videolibrary","targetId":"auction2","appName":"auction","resizingProfile":"auction","transcodingProfile":"auction"}}}}'>
  ...
</yahoo-pixelframe-drive>
```

- **webservice**

Set webservice config. Developers could set these config for save or gather exist video information.

`listings`：API for gather current user's exist video information.\
`create`：API for create video.\
`edit`：API for video title / description edit. Developers colud apply for `{{videoId}}` string replacement.\
`delete`：API for video delete. Developers colud apply for `{{videoId}}` string replacement.

```html
<yahoo-pixelframe-drive webservice='{"listings":"https://canary-reeldeal.ec.yahoo.com:4443/api/reeldeal/v1/me/videos?status=ACTIVE","create":"https://canary-reeldeal.ec.yahoo.com:4443/api/reeldeal/v1/videos","edit":"https://canary-reeldeal.ec.yahoo.com:4443/api/reeldeal/v1/videos/{{videoId}}","delete":"https://canary-reeldeal.ec.yahoo.com:4443/api/reeldeal/v1/videos/{{videoId}}"}'>
  ...
</yahoo-pixelframe-drive>
```

## Properties
| Property Name | Type | Description |
| ----------- | ----------- | ----------- |
| maxpickcount | Integer | Getter / Setter &lt;yahoo-pixelframe-drive />'s maxpickcount. |
| maxuploadcount | Integer | Getter / Setter &lt;yahoo-pixelframe-drive />'s maxuploadcount. |
| placeholder | String | Getter / Setter &lt;yahoo-pixelframe-drive />'s search field placehoder. |
| uploader | Object | Getter / Setter &lt;yahoo-pixelframe-drive />'s uploader config. （Developer could check &lt;yahoo-pixelframe-uploader />'s document） |
| webservice | Object | Getter / Setter &lt;yahoo-pixelframe-drive />'s webservice config. |
| open | Boolean | Getter &lt;yahoo-pixelframe-drive />'s open state. |

## Events
| Event Signature | Description |
| ----------- | ----------- |
| yahoo-pixelframe-drive-pick | Fired when <yahoo-pixelframe-drive /> user picked video files. Developers could gather picked information through `event.detail`. |
| yahoo-pixelframe-drive-error | Fired when <yahoo-pixelframe-drive /> error occured. Developers could gather information through `event.detail`. |

## Mathods
| Mathod Signature | Description |
| ----------- | ----------- |
| showModal() | Show &lt;yahoo-pixelframe-drive />. |
| close() | Close &lt;yahoo-pixelframe-drive />. |

## Reference
- [&lt;yahoo-pixelframe-drive /> demo](https://blog.lalacube.com/mei/webComponent_yahoo-pixelframe-drive.html)
- [YouTube tutorial](https://www.youtube.com/watch?v=XxqUU0GpEcM)
- [&lt;yahoo-pixelframe-uploader />](https://blog.lalacube.com/mei/webComponent_yahoo-pixelframe-uploader.html)
- [&lt;msc-dialogs />](https://blog.lalacube.com/mei/webComponent_msc-dialogs.html)
- [&lt;msc-circle-progress />](https://blog.lalacube.com/mei/webComponent_msc-circle-progress.html)