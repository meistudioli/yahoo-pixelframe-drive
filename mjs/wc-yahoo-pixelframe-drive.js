import { _wcl } from './common-lib.js';
import { _wccss } from './common-css.js';
import {
  colorPalette as _fujiColorPalette,
  input as _fujiInput,
  buttons as _fujiButtons
} from './fuji-css.js';
import Mustache from './mustache.js';

import 'https://unpkg.com/yahoo-pixelframe-uploader/wc-yahoo-pixelframe-uploader.js';
import 'https://unpkg.com/msc-dialogs/wc-msc-dialogs.js';
import 'https://unpkg.com/msc-circle-progress/wc-msc-circle-progress.js';

/*
 reference:
 - https://web.dev/at-property/
 - https://developer.mozilla.org/en-US/docs/Web/CSS/::placeholder
*/

const blankImage = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';
const defaults = {
  maxpickcount: 1,
  maxuploadcount: 100,
  placeholder: 'Search video',
  uploader: {
    multiple: true,
    accept: '.mov,.mp4,.ogg,.webm',
    imagelimitation: {
      minwidth: 100,
      minheight: 100,
      size: 1024 * 1024 * 50
    },
    videolimitation: {
      minwidth: 100,
      minheight: 100,
      size: 1024 * 1024 * 300,
      duration: 60 * 60
    },
    maximagecount: 0,
    maxvideocount: 20,
    webservice: {
      token: {
        url: 'https://trendr-apac.media.yahoo.com/api/pixelframe/v1/aws/resources/s3/credentials?role=content-upload'
      },
      upload: {
        urls: {
          video: 'https://trendr-apac.media.yahoo.com/api/pixelframe/v1/videos/upload',
          image: 'https://trendr-apac.media.yahoo.com/api/pixelframe/v1/images/upload'
        },
        params: {
          targetType: 'videolibrary',
          targetId: 'auction2',
          appName: 'auction',
          resizingProfile: 'auction',
          transcodingProfile: 'auction'
        }
      }
    }
  }
};

const booleanAttrs = []; // booleanAttrs default should be false
const objectAttrs = ['uploader'];
const custumEvents = {
  pick: 'yahoo-pixelframe-drive-pick'
};
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

const template = document.createElement('template');
template.innerHTML = `
<style>
${_wccss}
${_fujiColorPalette}
${_fujiInput}
${_fujiButtons}

:host {
  position: relative;
  display: block;
}

.main {
  --dialog-drive-inline-size: var(--yahoo-pixelframe-drive-drive-inline-size, 800px);

  /* text content */
  --dialog-drive-title: var(--yahoo-pixelframe-drive-drive-title, 'Video Library');
  --dialog-edit-title: var(--yahoo-pixelframe-drive-edit-title, 'Edit Video');
  --dialog-delete-title: var(--yahoo-pixelframe-drive-delete-title, 'Delete Video');
  --dd-hint: var(--yahoo-pixelframe-drive-drag-n-drop-hint, 'Drop video(s) here.');

  --dialog-drive-button-confirm: var(--yahoo-pixelframe-drive-drive-button-confirm-text, 'CONFIRM');
  --dialog-edit-button-confirm: var(--yahoo-pixelframe-drive-edit-button-confirm-text, 'CONFIRM');
  --dialog-edit-button-cancel: var(--yahoo-pixelframe-drive-edit-button-cancel-text, 'CANCEL');

  --dialog-delete-button-confirm: var(--yahoo-pixelframe-drive-delete-button-confirm-text, 'DELETE');
  --dialog-delete-button-cancel: var(--yahoo-pixelframe-drive-delete-button-cancel-text, 'CANCEL');

  --dialog-drive-no-result: var(--yahoo-pixelframe-drive-drive-no-result-text, 'No video exists.');

  --dialog-background-color: var(--yahoo-pixelframe-drive-dialog-background-color, rgba(255 255 255));
  --dialogs-title-color: var(--yahoo-pixelframe-drive-dialog-title-color, rgba(70 78 86));
  --dialogs-title-border-color: var(--yahoo-pixelframe-drive-dialog-title-border-color, rgba(130 138 147));

  --hr-color: var(--yahoo-pixelframe-drive-hr-color, rgba(224 228 233));

  --listing-no-result-text-color: var(--yahoo-pixelframe-drive-drive-no-result-text-color, rgba(70 78 86));

  --form-background-color-normal: var(--yahoo-pixelframe-drive-drive-search-normal-background-color, rgba(240 243 245));
  --form-background-color-active: var(--yahoo-pixelframe-drive-drive-search-active-background-color, rgba(224 228 233));
  --form-background-color: var(--form-background-color-normal);
  --form-input-color: var(--yahoo-pixelframe-drive-drive-search-input-color, rgba(35 42 49));
  --form-input-placeholder-color: var(--yahoo-pixelframe-drive-drive-search-input-placeholder-color, rgba(151 158 168));
  --form-search-icon-color: var(--yahoo-pixelframe-drive-drive-search-icon-color, rgba(35 42 49));
  --form-border-color: var(--yahoo-pixelframe-drive-drive-search-border-color, rgba(199 205 210));

  --listing-border-color: var(--yahoo-pixelframe-drive-drive-listing-border-color, rgba(224 228 233));
  --listing-overlay-background: var(--yahoo-pixelframe-drive-drive-listing-overlay-background, rgba(255 255 255/.35));

  --ft-info-color: var(--yahoo-pixelframe-drive-drive-pick-info-text-color, rgba(35 42 49));

  --button-accent-color: var(--yahoo-pixelframe-drive-action-button-accent-color, rgba(15 105 255));
  --button-inert-color: var(--yahoo-pixelframe-drive-action-button-inert-color, rgba(176 185 193));

  --add-video-button-icon-color: var(--yahoo-pixelframe-drive-drive-add-button-icon-color, rgba(230 50 89));
  --add-video-button-icon-inert-color: var(--yahoo-pixelframe-drive-drive-add-button-icon-inert-color, rgba(176 185 193));
  --add-video-button-active-background-color: var(--yahoo-pixelframe-drive-drive-add-button-active-background-color, rgba(242 242 242));

  --dialog-delete-title-text-color: var(--yahoo-pixelframe-drive-delete-title-text-color, rgba(35 42 49));
  --dialog-delete-description-text-color: var(--yahoo-pixelframe-drive-delete-description-text-color, rgba(176 185 193));

  --dialog-edit-input-background-color: var(--yahoo-pixelframe-drive-edit-input-background-color, rgba(255 255 255));
  --dialog-edit-input-text-color: var(--yahoo-pixelframe-drive-edit-input-text-color, rgba(35 42 49));
  --dialog-edit-input-border-color: var(--yahoo-pixelframe-drive-edit-input-border-color, rgba(110 119 128));
  --dialog-edit-input-placeholder-color: var(--yahoo-pixelframe-drive-edit-input-placeholder-color, rgba(70 78 86));
  --dialog-edit-input-label-text-color: var(--yahoo-pixelframe-drive-edit-input-label-text-color, rgba(110 119 128));
  --dialog-edit-input-theme-color: var(--yahoo-pixelframe-drive-edit-input-theme-color, rgba(15 105 255));

  --dd-hint-text-color: var(--yahoo-pixelframe-drive-drag-n-drop-hint-text-color, rgba(255 255 255));
  --dd-hint-overlay-color: var(--yahoo-pixelframe-drive-drag-n-drop-hint-overlay-color, rgba(0 0 0/.8));

  /* msc-dialogs */
  --msc-dialogs-margin: 24px;
  --msc-dialogs-padding: 24px;

  /* icon */
  --icon-search: path('M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z');
  --icon-add-circle: path('M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z');
  --icon-check: path('M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z');
  --icon-delete-forever: path('M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z');
  --icon-edit: path('M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z');

  /* dialogs-hr */
  --hr-margin: .75em;
  --hr-size: calc(var(--hr-margin) * 2 + 1px);

  /* dialogs-title */
  --dialogs-title-font-size: 1.125em;
  --dialogs-title-border-size: 1px;
  --dialogs-title-padding-block-end: 16px;
  --dialogs-title-block-size: calc(
    var(--dialogs-title-font-size)
    + var(--dialogs-title-padding-block-end)
    + var(--dialogs-title-border-size)
  );

  @media screen and (max-width: 767px) {
    --msc-dialogs-margin: 0px;
    --msc-dialogs-padding: 16px;
    --msc-dialogs-button-size: 32;
    --msc-dialogs-button-inset-inline-end: 8px;
    --msc-dialogs-button-inset-block-start: 8px;

    --dialogs-title-padding-block-end: 12px;
  }

  position: relative;
  outline: 0 none;

  .dialogs-hr {
    border: 0 none;
    border-top: 1px solid var(--hr-color);
    margin: var(--hr-margin);
  }

  .dialogs-title {
    font-size: var(--dialogs-title-font-size);
    font-weight: 500;
    line-height: 1;
    color: var(--dialogs-title-color);
    border-block-end: var(--dialogs-title-border-size) solid var(--dialogs-title-border-color);
    padding-block-end: var(--dialogs-title-padding-block-end);
    margin-block-end: var(--dialogs-title-padding-block-end);
  }
}

/* drive */
.drive {
  --main-padding: 0em;
  --main-inline-size: min(
    var(--dialog-drive-inline-size),
    calc(
      80dvi
      - (var(--msc-dialogs-margin) * 2)
      - (var(--msc-dialogs-padding) * 2)
    )
  );
  --ft-block-size: 36px;

  /* functions */
  --function-block-size: 48;
  --function-block-size-with-unit: calc(var(--function-block-size) * 1px);
  --function-icon-scale-rate: .75;
  --function-icon-scale-basis: calc((var(--function-block-size) * var(--function-icon-scale-rate)) / 24);
  --function-add-icon-color: var(--add-video-button-icon-color);
  --function-add-icon-color--inert: var(--add-video-button-icon-inert-color);

  --function-add-background-color-normal: transparent;
  --function-add-background-color-active: var(--add-video-button-active-background-color);
  --function-add-background-color: var(--function-add-background-color-normal);

  /* form */
  --form-block-size: 3em;
  --form-arrow-size: 4px;
  --form-gap: .5em;
  --form-padding-inline: 1em;

  /* listings */
  --listing-column-count: 3;
  --listing-gap: .75em;
  --listing-inline-size: calc((100% - ((var(--listing-column-count) - 1) * var(--listing-gap))) / var(--listing-column-count));
  --listing-button-margin: 6px;
  --listing-button-size: 28px;
  --listing-progress-size: 20px;
  --listing-checkmark-size: 28px;
  --listing-checkmark-background-color: rgba(56 113 227);
  --listing-min-block-size: 240px;
  --listing-max-block-size: calc(
    90dvb
    - var(--msc-dialogs-margin) * 2
    - var(--msc-dialogs-padding) * 2
    - var(--dialogs-title-block-size)
    - var(--function-block-size-with-unit)
    - var(--main-padding) * 2
    - var(--hr-size) * 2
    - var(--ft-block-size)
  );
  --listing-min-block-size: min(240px, var(--listing-max-block-size));
  --listing-no-result-text: var(--dialog-drive-no-result);

  /* ft */
  --ft-info-color--inert: rgba(176 185 193);
  --ft-visibility: visible;

  /* overlay */
  --overlay-opacity-normal: 0;
  --overlay-opacity-active: 1;
  --overlay-opacity: var(--overlay-opacity-normal);

  --overlay-pointer-events-normal: none; 
  --overlay-pointer-events-active: auto; 
  --overlay-pointer-events: var(--overlay-pointer-events-normal);

  inline-size: var(--main-inline-size);
  background-color: var(--dialog-background-color);
  box-sizing: border-box;
  padding: var(--main-padding);
  outline: 0 none;
  container-type: inline-size;

  @media screen and (max-width: 767px) {
    --main-inline-size: 100%;
  }

  @container (width >= 300px) {
    .drive__gallery {
      --listing-column-count: 3;
    }
  }

  @container (width >= 500px) {
    .drive__gallery {
      --listing-column-count: 4;
    }
  }

  @container (width >= 600px) {
    .drive__gallery {
      --listing-column-count: 5;
    }
  }

  @container (width >= 800px) {
    .drive__gallery {
      --listing-column-count: 6;
    }
  }

  &:not(:has(:nth-child(1 of .drive__gallery__unit))) {
    --ft-button-confirm-color: var(--ft-button-confirm-color--inert);
    --ft-info-color: var(--ft-info-color--inert);
    --ft-visibility: hidden;
  }

  &.drive--over {
    --overlay-opacity: var(--overlay-opacity-active);
    --overlay-pointer-events: var(--overlay-pointer-events-active);
  }

  .drive__wrap {
    position: relative;

    &::before {
      content: var(--dd-hint);

      position: absolute;
      inset: 0;
      font-size: 1.125em;
      color: var(--dd-hint-text-color);
      background-color: var(--dd-hint-overlay-color);
      z-index: 1;
      pointer-events: var(--overlay-pointer-events);
      border-radius: 1em;

      display: grid;
      place-content: center;

      opacity: var(--overlay-opacity);
      will-change: opacity;
      transition: opacity .15s ease;
    }
  }

  .drive__functions {
    display: flex;
    align-items: center;
    gap: .5em;

    yahoo-pixelframe-uploader[inert] {
      --function-add-icon-color: var(--function-add-icon-color--inert);
    }

    .drive__functions__trigger {
      flex-shrink: 0;
      font-size: 0;
      appearance: none;
      box-shadow: unset;
      border: unset;
      background: transparent;
      -webkit-user-select: none;
      user-select: none;
      pointer-events: auto;
      margin: 0;
      padding: 0;
      outline: 0 none;

      inline-size: var(--function-block-size-with-unit);
      aspect-ratio: 1/1;
      border-radius: var(--function-block-size-with-unit);
      background-color: var(--function-add-background-color);
      display: grid;
      place-content: center;
      transition: background-color .15s ease;
      will-change: background-color;

      &:active {
        scale: .85;
      }

      &:focus {
        --function-add-background-color: var(--function-add-background-color-active);
      }

      &::before {
        content: '';
        inline-size: 24px;
        aspect-ratio: 1/1;
        background-color: var(--function-add-icon-color);
        clip-path: var(--icon-add-circle);
        scale: var(--function-icon-scale-basis);
      }

      @media (hover: hover) {
        &:hover {
          --function-add-background-color: var(--function-add-background-color-active);
        }
      }
    }

    search {
      flex-grow: 1;
      min-inline-size: 0;
    }

    .drive__search__form {
      font-size: 1em;
      inline-size: 100%;
      block-size: var(--function-block-size-with-unit);
      border-radius: var(--function-block-size-with-unit);
      background-color: var(--form-background-color);
      box-sizing: border-box;
      padding-inline: var(--form-padding-inline);
      transition: background-color .15s ease;
      will-change: background-color;

      display: flex;
      align-items: center;

      @media (hover: hover) {
        &:hover {
          --form-background-color: var(--form-background-color-active);
        }
      }

      &:focus-within {
        --form-background-color: var(--form-background-color-active);
      }

      .drive__search__form__label {
        block-size: var(--form-block-size);
        display: flex;
        align-items: center;

        &:has(input) {
          flex-grow: 1;
          min-inline-size: 0;

          &::before {
            flex-shrink: 0;
            content: '';
            inline-size: 24px;
            aspect-ratio: 1/1;
            background-color: var(--form-search-icon-color);
            clip-path: var(--icon-search);
          }
        }

        &:has(select) {
          position: relative;

          &:after {
            position: absolute;
            flex-shrink: 0;
            content: '';
            inline-size: 0;
            block-size: 0;

            inset-inline-end: 0;
            inset-block-start: calc(50% + (var(--form-arrow-size) / 2));
            translate: 0 -50%; 

            border: var(--form-arrow-size) solid transparent;
            border-block-start-color: var(--form-input-color);
            pointer-events: none;
          }
        }
      }

      input,
      select {
        flex-grow: 1;

        font-size: inherit;
        color: var(--form-input-color);
        line-height: 2;
        text-overflow: ellipsis;

        min-inline-size: 0;
        box-sizing:border-box;
        background: transparent;
        appearance: none;
        -webkit-appearance: none;
        border: 0 none;
        resize: none;
        outline: 0 none;
        display: block;

        padding-inline: var(--form-gap);
      }

      input::placeholder {
        color: var(--form-input-placeholder-color);
      }

      select {
        flex-grow: revert;
        flex-shrink: 0;
        field-sizing: content;

        padding-inline: 1em;
        border-inline-start: 1px solid var(--form-border-color);
      }

      .drive__search__form__prevent-submit {
        display: none;
      }
    }
  }

  .drive__main {
    position: relative;
    display: block;

    &:has(.drive__gallery:empty)::after {
      position: absolute;
      inset-inline-start: 50%;
      inset-block-start: 50%;
      translate: -50% -50%;

      content: var(--listing-no-result-text);
      font-size: 1.25em;
      color: var(--listing-no-result-text-color);
    }

    .drive__main__action {
      visibility: var(--ft-visibility);
      display: flex;
      gap: 1em;
      align-items: center;

      .drive__main__action__info {
        flex-shrink: 0;
        color: var(--ft-info-color);
      }

      .buttons[data-type='secondary1'] {
        --default-text-color: var(--button-accent-color);

        flex-grow: 1;
        min-inline-size: 0;

        &[inert] {
          --default-text-color: var(--button-inert-color);
        }
      }
    }
  }

  .drive__gallery {
    --fade-in-out-min-block-size: var(--listing-min-block-size);
    --fade-in-out-max-block-size: var(--listing-max-block-size);
    --listing-inline-size: calc((100% - ((var(--listing-column-count) - 1) * var(--listing-gap))) / var(--listing-column-count));

    position: relative;
    display: flex;
    gap: var(--listing-gap);
    flex-wrap: wrap;
    align-items: flex-start;
    align-content: flex-start;

    &:empty {
      mask-image: initial;
      -webkit-mask-image: initial;
    }

    .drive__gallery__unit {
      --warn-bar-size: .75em;
      --warn-bar-strip-start-color: #de2f21;
      --warn-bar-strip-end-color: rgba(0 0 0);
      --warn-scale-normal: .001;
      --warn-scale-active: 1;
      --warn-scale: var(--warn-scale-normal);

      --checkmark-opacity-normal: 0;
      --checkmark-opacity-active: 1;
      --checkmark-opacity: var(--checkmark-opacity-normal);
      
      --checkmark-scale-normal: .001;
      --checkmark-scale-active: 1;
      --checkmark-scale: var(--checkmark-scale-normal);

      --overlay-opacity-normal: 0;
      --overlay-opacity-active: 1;
      --overlay-opacity: var(--overlay-opacity-normal);

      --button-opacity-normal: 0;
      --button-opacity-active: 1;
      --button-opacity: var(--button-opacity-normal);
      
      --button-scale-normal: .001;
      --button-scale-active: 1;
      --button-scale: var(--button-scale-normal);

      --progress-opacity-normal: 1;
      --progress-opacity-active: 0;
      --progress-opacity: var(--progress-opacity-normal);

      --progress-scale-normal: 1;
      --progress-scale-active: .001;
      --progress-scale: var(--progress-scale-normal);

      position: relative;
      inline-size: var(--listing-inline-size);
      aspect-ratio: 1/1;
      border-radius: .5em;
      overflow: hidden;
      box-sizing: border-box;
      border: 1px solid var(--listing-border-color);

      @media (hover: hover) {
        &[data-status=done]:not(:has(:checked)):hover {
          --button-opacity: var(--button-opacity-active);
          --button-scale: var(--button-scale-active);
        }
      }

      @media not (hover: hover) {
        &[data-status=done]:not(:has(:checked)) {
          --button-opacity: var(--button-opacity-active);
          --button-scale: var(--button-scale-active);
        }
      }

      &.drive__gallery__unit--remove {
        animation: animate-remove-gallery-unit .35s ease-in-out forwards;
      }

      &[data-status=done] {
        --progress-opacity: var(--progress-opacity-active);
        --progress-scale: var(--progress-scale-active);
      }

      &[data-status=error] {
        --warn-scale: var(--warn-scale-active);
        --progress-opacity: var(--progress-opacity-active);
        --progress-scale: var(--progress-scale-active);

        [data-action=delete] {
          --button-opacity: var(--button-opacity-active);
          --button-scale: var(--button-scale-active);
        }
      }

      &:has(input:checked) {
        --checkmark-opacity: var(--checkmark-opacity-active);
        --checkmark-scale: var(--checkmark-scale-active);
        --overlay-opacity: var(--overlay-opacity-active);
        --button-opacity: var(--button-opacity-normal);
        --button-scale: var(--button-scale-normal);
      }

      &[data-status=done]:active {
        scale: .95;
      }

      label {
        position: relative;
        inline-size: 100%;
        block-size: 100%;
        display: block;

        &::before {
          content: '';
          position: absolute;
          inset: 0;
          margin: 0;
          background: var(--listing-overlay-background);
          opacity: var(--overlay-opacity);
          transition: opacity .15s ease;
          will-change: opacity;
          z-index: 1;
        }
      }

      input {
        position: absolute;
        inset: -100% auto auto 0;
      }

      img {
        inline-size: 100%;
        block-size: 100%;
        display: block;
        object-fit: cover;
        border-radius: inherit;
      }

      .drive__gallery__unit__checkmark {
        position: absolute;
        inset: 0 auto auto 0;
        inline-size: var(--listing-checkmark-size);
        block-size: var(--listing-checkmark-size);
        background-color: var(--listing-checkmark-background-color);
        border-radius: var(--listing-checkmark-size);
        margin: var(--listing-button-margin);
        display: grid;
        place-content: center;
        opacity: var(--checkmark-opacity);
        scale: var(--checkmark-scale);
        transition: opacity .15s ease,scale .15s ease;
        will-change: opacity,scale;
        pointer-events: none;
        z-index: 2;

        border: 2px solid rgba(255 255 255);
        box-sizing: border-box;

        &::before {
          content: '';
          inline-size: 24px;
          aspect-ratio: 1/1;
          background-color: rgba(255 255 255);
          clip-path: var(--icon-check);
          display: block;
          scale: .75;
        }
      }

      .drive__gallery__unit__button {
        --inset: 0;
        --icon: initial;

        flex-shrink: 0;
        font-size: 0;
        appearance: none;
        box-shadow: unset;
        border: unset;
        background: transparent;
        -webkit-user-select: none;
        user-select: none;
        pointer-events: auto;
        margin: 0;
        padding: 0;
        outline: 0 none;

        position: absolute;
        inset: var(--inset);
        inline-size: var(--listing-button-size);
        aspect-ratio: 1/1;
        border-radius: var(--listing-button-size);
        background-color: rgba(0 0 0/.7);
        margin: var(--listing-button-margin);
        display: grid;
        place-content: center;
        opacity: var(--button-opacity);
        scale: var(--button-scale);
        transition: opacity .15s ease,scale .15s ease;
        will-change: opacity,scale;
        z-index: 1;

        &:active {
          scale: .9;
        }

        &::before {
          content: '';
          inline-size: 24px;
          aspect-ratio: 1/1;
          background-color: rgba(255 255 255);
          clip-path: var(--icon);
          display: block;
          scale: .9;
        }

        &[data-action=delete] {
          --inset: auto 0 0 auto;
          --icon: var(--icon-delete-forever);
        }

        &[data-action=edit] {
          --inset: auto auto 0 0;
          --icon: var(--icon-edit);
        }
      }

      .drive__gallery__unit__progress {
        --msc-circle-progress-font-color: transparent;
        --msc-circle-progress-color: #fff;

        position: absolute;
        inset: auto 0 0 auto;
        inline-size: var(--listing-button-size);
        aspect-ratio: 1/1;
        border-radius: var(--listing-button-size);
        background-color: rgba(0 0 0/.7);
        margin: var(--listing-button-margin);
        display: grid;
        place-content: center;
        pointer-events: none;

        opacity: var(--progress-opacity);
        scale: var(--progress-scale);
        transition: opacity .15s ease,scale .15s ease;
        will-change: opacity,scale;

        msc-circle-progress {
          inline-size: var(--listing-progress-size);
        }
      }

      .drive__gallery__unit__warn {
        position: absolute;
        inset-inline-start: 0;
        inset-block-start: 0;
        inline-size: 100%;
        block-size: 100%;
        background-color: rgba(255 0 0/.3);
        pointer-events: none;
        animation: animate-warn 1s ease-in-out infinite;

        transition: scale .15s ease-in-out;
        will-change: scale;
        scale: var(--warn-scale);

        overflow: hidden;
        pointer-events: none;

        &::before,
        &::after {
          position: absolute;
          inset-inline-start: 0;
          inline-size: 100%;
          block-size: var(--warn-bar-size);
          content: '';
          background-size: 24px var(--warn-bar-size);
          background-image: -webkit-linear-gradient(-45deg, var(--warn-bar-strip-start-color) 33%, var(--warn-bar-strip-end-color) 33%, var(--warn-bar-strip-end-color) 66%, var(--warn-bar-strip-start-color) 66%);
        }

        &::before {
          inset-block-start: 0;
          animation: animate-warn-bar-block-start 60s linear infinite;
        }

        &::after {
          inset-block-end: 0;
          animation: animate-warn-bar-block-end 60s linear infinite;
        }

        .drive__gallery__unit__warn__span {
          position: absolute;
          inset-block: 0;
          margin: auto;
          inline-size: 100%;
          block-size: fit-content;
          display: block;
          background-color: rgba(0 0 0/.75);
          color: var(--warn-bar-strip-start-color);
          line-height: 2.2;
          text-align: center;
          font-size: 1em;
          font-weight: 800;
          border-block-start: 2px solid var(--warn-bar-strip-start-color);
          border-block-end: 2px solid var(--warn-bar-strip-start-color);
        }
      }
    }
  }
}

@keyframes animate-warn-bar-block-start {
  100% { background-position: -3000% 0px; }
}

@keyframes animate-warn-bar-block-end {
  100% { background-position: 3000% 0px; }
}

@keyframes animate-warn {
  0% { opacity: .5; }
  50% { opacity: 1; }
  100%{ opacity: .5; }
}

@keyframes animate-remove-gallery-unit {
  0% { opacity: 1; translate: 0% 0%; }
  100% { opacity: 0; translate: 0% -35%; }
}

/* video-dialog */
.video-dialog {
  --default-theme: rgba(56 113 227);
  --default-accent-color: rgba(56 113 227);
  --main-inline-size: min(
    440px,
    calc(
      80dvi
      - (var(--msc-dialogs-margin) * 2)
      - (var(--msc-dialogs-padding) * 2)
    )
  );

  @media screen and (max-width: 767px) {
    --main-inline-size: 100%;
  }

  inline-size: var(--main-inline-size);
  box-sizing: border-box;
  background-color: var(--dialog-background-color);
  
  .video-dialog__info {
    margin-block-start: 1.5em;
    display: flex;
    gap: 1em;
    align-items: flex-start;

    img {
      flex-shrink: 0;
      inline-size: 7.5em;
      aspect-ratio: 1/1;
      object-fit: cover;
      display: block;
      border: 1px solid var(--listing-border-color);
      border-radius: 1em;
      box-sizing: border-box;
    }

    .video-dialog__info__contents {
      flex-grow: 1;
      min-inline-size: 0;
      display: flex;
      flex-direction: column;
      gap: 1em;

      .video-dialog__info__contents__title {
        font-size: 1.125em;
        font-weight: 500;
        color: var(--dialog-delete-title-text-color);
      }

      .video-dialog__info__contents__description {
        font-size: .875em;
        color: var(--dialog-delete-description-text-color);
      }

      .input-set {
        --default-background-color: var(--dialog-edit-input-background-color);
        --default-text-color: var(--dialog-edit-input-text-color);
        --default-border-color: var(--dialog-edit-input-border-color);
        --default-placeholder-text-color: var(--dialog-edit-input-placeholder-color);
        --default-label-text-color: var(--dialog-edit-input-label-text-color);
        --default-theme: var(--dialog-edit-input-theme-color);
      }
    }
  }

  .video-dialog__actions {
    inline-size: 100%;
    display: flex;
    gap: 1em;
    align-items: center;
    justify-content: end;

    .buttons[data-type='primary'],
    .buttons[data-type='secondary1'] {
      --default-background-color: var(--button-accent-color);
      --default-text-color: var(--button-accent-color);

      &[inert] {
        --default-text-color: var(--button-inert-color);
      }
    }
  }
}

.dialog-drive {
  .dialogs-title::before {
    content: var(--dialog-drive-title);
  }

  .buttons span::before {
    content: var(--dialog-drive-button-confirm);
  }
}

.dialog-edit {
  .dialogs-title::before {
    content: var(--dialog-edit-title);
  }

  .buttons[value=submit] span::before {
    content: var(--dialog-edit-button-confirm);
  }

  .buttons[value=cancel] span::before {
    content: var(--dialog-edit-button-cancel);
  }
}

.dialog-delete {
  .dialogs-title::before {
    content: var(--dialog-delete-title);
  }

  .buttons[value=submit] span::before {
    content: var(--dialog-delete-button-confirm);
  }

  .buttons[value=cancel] span::before {
    content: var(--dialog-delete-button-cancel);
  }
}
</style>

<div class="main" ontouchstart="" tabindex="0">
  <!-- drive -->
  <msc-dialogs class="dialog-drive">
    <div class="drive" tabindex="0">
      <p class="dialogs-title"></p>

      <div class="drive__wrap">
        <div class="drive__functions">
          <yahoo-pixelframe-uploader>
            <script type="application/json">
${JSON.stringify(defaults.uploader, null, 2)}
            </script>

            <div
              class="drive__functions__trigger"
              tabindex="0"
              role="button"
              slot="trigger"
            ></div>
          </yahoo-pixelframe-uploader>

          <search>
            <form class="drive__search__form" autocorrect="off" autocomplete="off" autocapitalize="off">
              <label class="drive__search__form__label">
                <input type="search" name="q" placeholder="${defaults.placeholder}" />
              </label>

              <!--
              <label class="drive__search__form__label">
                <select name="sort">
                  <option disabled>Category</option>
                  <hr />
                  <option value="all">All</option>
                  <option value="toys">Toys</option>
                  <option value="video-games">Video Games</option>
                </select>
              </label>
              -->

              <input type="text" class="drive__search__form__prevent-submit" name="prevent-submit">
            </form>
          </search>
        </div>

        <hr class="dialogs-hr" />

        <form class="drive__main">
          <div class="drive__gallery fade-in-out"></div>
        
          <hr class="dialogs-hr" />

          <div class="drive__main__action">
            <span class="drive__main__action__info">
              <em class="drive__main__action__info__pickcount">0</em> / <em class="drive__main__action__info__maxpickcount">${defaults.maxpickcount}</em>
            </span>
            <button
              type="submit"
              class="buttons"
              data-type="secondary1"
              data-size="medium"
              inert
            >
              <span></span> 
            </button>
          </div>
        </form>
      </div>
    </div>
  </msc-dialogs>

  <!-- edit -->
  <msc-dialogs class="dialog-edit">
    <form class="video-dialog" autocorrect="off" autocomplete="off" autocapitalize="off">
      <p class="dialogs-title"></p>

      <div class="video-dialog__info">
        <img src="${blankImage}" loading="eager" data-ref="image" />
        <div class="video-dialog__info__contents">
          <div class="input-set esc-dark-mode">
            <input name="title" type="text" placeholder="input video title" value="" data-ref="name" />
            <label class="input-set__label">
              <span class="input-set__label__span">Title</span>
            </label>
            <em class="input-set__em"></em>
          </div>

          <div class="input-set esc-dark-mode">
            <textarea name="description" placeholder="input video description" data-ref="description"></textarea>
            <label class="input-set__label">
              <span class="input-set__label__span">Description</span>
            </label>
            <em class="input-set__em"></em>
          </div>

          <input type="hidden" name="id" data-ref="id" />
        </div>
      </div>

      <hr class="dialogs-hr" />

      <div class="video-dialog__actions" >
        <button
          type="submit"
          class="buttons"
          data-type="primary"
          data-size="medium"
          value="submit"
        >
          <span></span> 
        </button>

        <button
          type="submit"
          class="buttons"
          data-type="secondary1"
          data-size="medium"
          value="cancel"
        >
          <span></span>  
        </button>
      </div>
    </form>
  </msc-dialogs>

  <!-- delete -->
  <msc-dialogs class="dialog-delete">
    <form class="video-dialog" autocorrect="off" autocomplete="off" autocapitalize="off">
      <p class="dialogs-title"></p>

      <div class="video-dialog__info">
        <img src="${blankImage}" loading="eager" data-ref="image" />
        <div class="video-dialog__info__contents">
          <p class="video-dialog__info__contents__title" data-ref="name"></p>
          <p class="video-dialog__info__contents__description pretty-paragraph" data-ref="description"></p>
        </div>

        <input type="hidden" name="id" data-ref="id" />
      </div>

      <hr class="dialogs-hr" />

      <div class="video-dialog__actions" >
        <button
          type="submit"
          class="buttons"
          data-type="primary"
          data-size="medium"
          value="submit"
        >
          <span></span>  
        </button>

        <button
          type="submit"
          class="buttons"
          data-type="secondary1"
          data-size="medium"
          value="cancel"
        >
          <span></span>
        </button>
      </div>
    </form>
  </msc-dialogs>
</div>
`;

const templateUnit = document.createElement('template');
templateUnit.innerHTML = `
{{#units}}
<div class="drive__gallery__unit" data-status="{{status}}" data-id="{{id}}">
  <label>
    <span class="drive__gallery__unit__checkmark"></span>
    
    {{#freeze}}
    <input type="checkbox" name="pickedVideoIds" value="{{id}}" disabled />
    {{/freeze}}

    {{^freeze}}
    <input type="checkbox" name="pickedVideoIds" value="{{id}}" />
    {{/freeze}}
    
    <img src="{{thumbnail}}" loading="lazy" />
    
    <div class="drive__gallery__unit__progress">
      <msc-circle-progress size="3" value="0" round></msc-circle-progress>
    </div>

    <div class="drive__gallery__unit__warn">
      <span class="drive__gallery__unit__warn__span">ERROR</span>
    </div>
  </label>

  <button
    type="button"
    class="drive__gallery__unit__button"
    data-action="delete"
    title="delete"
  >
    delete
  </button>
  <button
    type="button"
    class="drive__gallery__unit__button"
    data-action="edit"
    title="edit"
  >
    delete
  </button>
</div>
{{/units}}
`;

// Houdini Props and Vals
if (CSS?.registerProperty) {
  try {
    CSS.registerProperty({
      name: '--yahoo-pixelframe-drive-drive-inline-size',
      syntax: '<length>',
      inherits: true,
      initialValue: '800px'
    });

    CSS.registerProperty({
      name: '--yahoo-pixelframe-drive-dialog-background-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(255 255 255)'
    });

    CSS.registerProperty({
      name: '--yahoo-pixelframe-drive-dialog-title-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(70 78 86)'
    });

    CSS.registerProperty({
      name: '--yahoo-pixelframe-drive-dialog-title-border-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(130 138 147)'
    });

    CSS.registerProperty({
      name: '--yahoo-pixelframe-drive-hr-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(224 228 233)'
    });

    CSS.registerProperty({
      name: '--yahoo-pixelframe-drive-drive-no-result-text-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(70 78 86)'
    });

    CSS.registerProperty({
      name: '--yahoo-pixelframe-drive-drive-search-normal-background-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(240 243 245)'
    });

    CSS.registerProperty({
      name: '--yahoo-pixelframe-drive-drive-search-active-background-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(224 228 233)'
    });

    CSS.registerProperty({
      name: '--yahoo-pixelframe-drive-drive-search-input-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(35 42 49)'
    });

    CSS.registerProperty({
      name: '--yahoo-pixelframe-drive-drive-search-input-placeholder-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(151 158 168)'
    });

    CSS.registerProperty({
      name: '--yahoo-pixelframe-drive-drive-search-icon-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(35 42 49)'
    });

    CSS.registerProperty({
      name: '--yahoo-pixelframe-drive-drive-search-border-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(199 205 210)'
    });

    CSS.registerProperty({
      name: '--yahoo-pixelframe-drive-drive-listing-border-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(224 228 233)'
    });

    CSS.registerProperty({
      name: '--yahoo-pixelframe-drive-drive-listing-overlay-background',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(255 255 255/.35)'
    });

    CSS.registerProperty({
      name: '--yahoo-pixelframe-drive-drive-pick-info-text-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(35 42 49)'
    });

    CSS.registerProperty({
      name: '--yahoo-pixelframe-drive-action-button-accent-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(15 105 255)'
    });

    CSS.registerProperty({
      name: '--yahoo-pixelframe-drive-action-button-inert-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(176 185 193)'
    });

    CSS.registerProperty({
      name: '--yahoo-pixelframe-drive-drive-add-button-icon-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(230 50 89)'
    });

    CSS.registerProperty({
      name: '--yahoo-pixelframe-drive-drive-add-button-icon-inert-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(176 185 193)'
    });

    CSS.registerProperty({
      name: '--yahoo-pixelframe-drive-drive-add-button-active-background-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(242 242 242)'
    });

    CSS.registerProperty({
      name: '--yahoo-pixelframe-drive-delete-title-text-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(35 42 49)'
    });

    CSS.registerProperty({
      name: '--yahoo-pixelframe-drive-delete-description-text-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(176 185 193)'
    });

    CSS.registerProperty({
      name: '--yahoo-pixelframe-drive-edit-input-background-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(255 255 255)'
    });

    CSS.registerProperty({
      name: '--yahoo-pixelframe-drive-edit-input-text-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(35 42 49)'
    });

    CSS.registerProperty({
      name: '--yahoo-pixelframe-drive-edit-input-border-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(110 119 128)'
    });

    CSS.registerProperty({
      name: '--yahoo-pixelframe-drive-edit-input-placeholder-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(70 78 86)'
    });

    CSS.registerProperty({
      name: '--yahoo-pixelframe-drive-edit-input-label-text-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(110 119 128)'
    });

    CSS.registerProperty({
      name: '--yahoo-pixelframe-drive-edit-input-theme-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(15 105 255)'
    });

    CSS.registerProperty({
      name: '--yahoo-pixelframe-drive-drag-n-drop-hint-text-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(255 255 255)'
    });

    CSS.registerProperty({
      name: '--yahoo-pixelframe-drive-drag-n-drop-hint-overlay-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(0 0 0/.8)'
    });
  } catch(err) {
    console.warn(`yahoo-pixelframe-drive: ${err.message}`);
  }
}

export class YahooPixelframeDrive extends HTMLElement {
  #data;
  #nodes;
  #config;

  constructor(config) {
    super();

    // template
    this.attachShadow({ mode: 'open', delegatesFocus: true });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // data
    this.#data = {
      controller: '',
      dragCount: 0,
      listings: {},
      orders: []
    };

    // nodes
    this.#nodes = {
      styleSheet: this.shadowRoot.querySelector('style'),
      main: this.shadowRoot.querySelector('.main'),
      uploader: this.shadowRoot.querySelector('yahoo-pixelframe-uploader'),
      dialogDrive: this.shadowRoot.querySelector('.dialog-drive'),
      dialogEdit: this.shadowRoot.querySelector('.dialog-edit'),
      dialogDelete: this.shadowRoot.querySelector('.dialog-delete'),
      drive: this.shadowRoot.querySelector('.dialog-drive .drive'),
      formDriveMain: this.shadowRoot.querySelector('.dialog-drive .drive__main'),
      formSearch: this.shadowRoot.querySelector('.drive__search__form'),
      formEdit: this.shadowRoot.querySelector('.dialog-edit .video-dialog'),
      formDelete: this.shadowRoot.querySelector('.dialog-delete .video-dialog'),
      gallery: this.shadowRoot.querySelector('.drive__gallery'),
      btnPick: this.shadowRoot.querySelector('.dialog-drive .drive__main .buttons'),
      infoMaxPickCount: this.shadowRoot.querySelector('.drive__main__action__info__maxpickcount'),
      infoPickCount: this.shadowRoot.querySelector('.drive__main__action__info__pickcount'),
    };

    // config
    this.#config = {
      ...defaults,
      ...config // new YahooPixelframeDrive(config)
    };

    // evts
    this._uploaderHandler = this._uploaderHandler.bind(this);
    this._onGalleryClick = this._onGalleryClick.bind(this);
    this._onAnimationEnd = this._onAnimationEnd.bind(this);
    this._onDialogsClose = this._onDialogsClose.bind(this);
    this._editHandler = this._editHandler.bind(this);
    this._deleteHandler = this._deleteHandler.bind(this);
    this._onPick = this._onPick.bind(this);
    this._onSubmit = this._onSubmit.bind(this);
    this._onSearchInput = this._onSearchInput.bind(this);

    this._onDnD = this._onDnD.bind(this);
    this._hintHandler = this._hintHandler.bind(this);
  }

  async connectedCallback() {
    const { config, error } = await _wcl.getWCConfig(this);
    const {
      main,
      uploader,
      gallery,
      formDriveMain,
      formSearch,
      formEdit,
      formDelete,
      drive
    } = this.#nodes;

    if (error) {
      console.warn(`${_wcl.classToTagName(this.constructor.name)}: ${error}`);
      this.remove();
      return;
    } else {
      this.#config = {
        ...this.#config,
        ...config
      };
    }

    // upgradeProperty
    Object.keys(defaults).forEach((key) => this.#upgradeProperty(key));

    // evts
    this.#data.controller = new AbortController();
    const signal = this.#data.controller.signal;
    const uploaderClass = customElements.get('yahoo-pixelframe-uploader');
    const { supportedEvents } = uploaderClass;
    gallery.addEventListener('click', this._onGalleryClick, { signal });
    gallery.addEventListener('animationend', this._onAnimationEnd, { signal });

    formDriveMain.addEventListener('input', this._onPick, { signal });
    formDriveMain.addEventListener('submit', this._onSubmit, { signal });
    formSearch.addEventListener('input', this._onSearchInput, { signal });

    formEdit.addEventListener('submit', this._editHandler, { signal });
    formEdit.addEventListener('input', this._editHandler, { signal });
    formDelete.addEventListener('submit', this._deleteHandler, { signal });
    
    main.addEventListener('msc-dialogs-close', this._onDialogsClose, { signal });

    // uploader
    supportedEvents.forEach(
      (event) => {
        uploader.addEventListener(event, this._uploaderHandler, { signal });
      }
    );

    // drive
    ['dragover', 'drop', 'paste'].forEach(
      (event) => {
        drive.addEventListener(event, this._onDnD, { signal, capture: true });
      }
    );

    // hint
    const hintEvents = ['dragover', 'dragleave'];
    
    if (isSafari) {
      hintEvents.push('dragenter');
    }

    hintEvents.forEach(
      (event) => {
        document.body.addEventListener(event, this._hintHandler, { signal, capture:true });
      }
    );
  }

  disconnectedCallback() {
    if (this.#data?.controller) {
      this.#data.controller.abort();
    }
  }

  #format(attrName, oldValue, newValue) {
    const hasValue = newValue !== null;

    if (!hasValue) {
      if (booleanAttrs.includes(attrName)) {
        this.#config[attrName] = false;
      } else {
        this.#config[attrName] = defaults[attrName];
      }
    } else {
      switch (attrName) {
        case 'placeholder': {
          this.#config[attrName] = newValue.trim() || defaults[attrName];
          break;
        }

        case 'maxuploadcount':
        case 'maxpickcount': {
          const num = +newValue;
          this.#config[attrName] = (isNaN(num) || num < 0) ? defaults[attrName] : num;
          break;
        }

        case 'uploader': {
          let values;
          try {
            values = JSON.parse(newValue);
          } catch(err) {
            console.warn(`${_wcl.classToTagName(this.constructor.name)}: ${err.message}`);
            values = Array.isArray(defaults[attrName]) ? [ ...defaults[attrName] ] : { ...defaults[attrName] };
          }

          this.#config[attrName] = {
            ...defaults[attrName],
            ...values
          };
          break;
        }
      }
    }
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (!YahooPixelframeDrive.observedAttributes.includes(attrName)) {
      return;
    }

    this.#format(attrName, oldValue, newValue);

    switch (attrName) {
      case 'uploader': {
        // set uploader config
        Object.keys(this.uploader).forEach(
          (key) => {
            this.#nodes.uploader[key] = this.uploader[key];
          }
        );
        break;
      }

      case 'maxpickcount': {
        this.#nodes.infoMaxPickCount.textContent = this.maxpickcount;
        break;
      }

      case 'placeholder': {
        this.#nodes.formSearch.querySelector('input[type=search]').placeholder = this.placeholder;
        break;
      }
    }
  }

  static get observedAttributes() {
    return Object.keys(defaults); // YahooPixelframeDrive.observedAttributes
  }

  static get supportedEvents() {
    return Object.keys(custumEvents).map(
      (key) => {
        return custumEvents[key];
      }
    );
  }

  #upgradeProperty(prop) {
    let value;

    if (YahooPixelframeDrive.observedAttributes.includes(prop)) {
      if (Object.prototype.hasOwnProperty.call(this, prop)) {
        value = this[prop];
        delete this[prop];
      } else {
        if (booleanAttrs.includes(prop)) {
          value = (this.hasAttribute(prop) || this.#config[prop]) ? true : false;
        } else if (objectAttrs.includes(prop)) {
          value = this.hasAttribute(prop) ? this.getAttribute(prop) : JSON.stringify(this.#config[prop]);
        } else {
          value = this.hasAttribute(prop) ? this.getAttribute(prop) : this.#config[prop];
        }
      }

      this[prop] = value;
    }
  }

  set maxuploadcount(value) {
    if (typeof value !== 'undefined') {
      this.setAttribute('maxuploadcount', value);
    } else {
      this.removeAttribute('maxuploadcount');
    }
  }

  get maxuploadcount() {
    return this.#config.maxuploadcount;
  }

  set maxpickcount(value) {
    if (typeof value !== 'undefined') {
      this.setAttribute('maxpickcount', value);
    } else {
      this.removeAttribute('maxpickcount');
    }
  }

  get maxpickcount() {
    return this.#config.maxpickcount;
  }

  set placeholder(value) {
    if (typeof value !== 'undefined') {
      this.setAttribute('placeholder', value);
    } else {
      this.removeAttribute('placeholder');
    }
  }

  get placeholder() {
    return this.#config.placeholder;
  }

  set uploader(value) {
    if (value) {
      const newValue = {
        ...defaults.uploader,
        ...this.uploader,
        ...(typeof value === 'string' ? JSON.parse(value) : value)
      };
      this.setAttribute('uploader', JSON.stringify(newValue));
    } else {
      this.removeAttribute('uploader');
    }
  }

  get uploader() {
    return this.#config.uploader;
  }

  get open() {
    return this.#nodes.dialogDrive.open;
  }

  #fireEvent(evtName, detail) {
    this.dispatchEvent(new CustomEvent(evtName,
      {
        bubbles: true,
        composed: true,
        ...(detail && { detail })
      }
    ));
  }

  #decorateDialog({ action, data }) {
    const { id, name, description, thumbnail  } = data;
    const dialog = this.#nodes[`dialog${_wcl.capitalize(action)}`];
    const nodeId = dialog.querySelector('[data-ref=id]');
    const nodeImg = dialog.querySelector('[data-ref=image]');
    const nodeName = dialog.querySelector('[data-ref=name]');
    const nodeDescription = dialog.querySelector('[data-ref=description]');

    nodeId.value = id;
    nodeImg.src = thumbnail;
    nodeName[action === 'edit' ? 'value' : 'textContent'] = name;
    nodeDescription[action === 'edit' ? 'value' : 'textContent'] = description;

    return dialog;
  }

  _onGalleryClick(evt) {
    const { target } = evt;
    const button = target.closest('button');

    if (!button) {
      return;
    }

    const host = target.closest('[data-id]');
    const { id, status } = host.dataset;
    const action = button.dataset.action;
    const data = this.#data.listings[id];

    if (!data) {
      return;
    }

    // delete directly when upload error
    if (status === 'error' && action === 'delete') {
      this.#deleteUnit(id);
      return;
    }

    const dialog = this.#decorateDialog({ action, data });
    dialog.showModal();
  }

  #deleteUnit(id) {
    const idx = this.#data.orders.findIndex((I) => I === id);
    const unit = this.#nodes.gallery.querySelector(`[data-id=${id}]`);

    if (idx != -1) {
      this.#data.orders.splice(idx, 1);
    }

    if (this.#data.listings[id]) {
      delete(this.#data.listings[id]);
    }
    
    if (unit) {
      unit.classList.add('drive__gallery__unit--remove');
    }
  }

  _onAnimationEnd(evt) {
    const { animationName, target } = evt;

    if (animationName === 'animate-remove-gallery-unit') {
      target.remove();

      if (!this.#data.orders.length) {
        this.#nodes.gallery.replaceChildren();
      }

      this.#checkBtnPick();
      this.#checkUploadCount();
    }
  }

  _uploaderHandler(evt) {
    const { type } = evt;
    const { uploader, gallery } = this.#nodes;

    switch (type) {
      case 'yahoo-pixelframe-uploader-process-start': {
        uploader.inert = true;
        break;
      }

      case 'yahoo-pixelframe-uploader-process-end': {
        uploader.inert = false;
        break;
      }

      case 'yahoo-pixelframe-uploader-done': {
        const { results } = evt.detail;

        results.forEach(
          (data) => {
            const { result, id } = data;

            if (this.#data.listings[id] && result) {
              this.#data.listings[id].result = { ...result };
            } 
          }
        );

        this.#checkUploadCount();
        break;
      }

      case 'yahoo-pixelframe-uploader-pick': {
        const { picked = [] } = evt.detail;
        const units = [];
        const ids = [];

        picked.forEach(
          (data) => {
            const { id, thumbnail } = data;

            ids.push(id);
            units.push({
              id,
              thumbnail,
              status: 'processing',
              freeze: true
            });

            this.#data.listings[id] = {
              ...data,
              status: 'processing',
              description: ''
            };
          }
        );

        this.#data.orders = [
          ...ids,
          ...this.#data.orders
        ];

        const unitsString = Mustache.render(templateUnit.innerHTML, { units });
        gallery.insertAdjacentHTML('afterbegin', unitsString);
        break;
      }

      case 'yahoo-pixelframe-uploader-progress': {
        const { id, progress } = evt.detail;
        const unit = gallery.querySelector(`[data-id=${id}]`);
        const circleProgress = gallery.querySelector(`[data-id=${id}] msc-circle-progress`);

        if (unit && circleProgress) {
          circleProgress.value = progress;

          if (progress === 100) {
            this.#data.listings[id].status = 'done';

            unit.dataset.status = 'done';
            unit.querySelector('input').disabled = false;
          }
        }
        break;
      }

      case 'yahoo-pixelframe-uploader-error': {
        const { id } = evt.detail;
        const unit = gallery.querySelector(`[data-id=${id}]`);

        if (unit) {
          this.#data.listings[id].status = 'error';
          unit.dataset.status = 'error';
          unit.querySelector('input').disabled = true;
        }
        break;
      }
    }
  }

  #resetForm(dialog) {
    const action = dialog.className.replace(/.*-(.*)/, '$1');
    const form = dialog.querySelector('form');

    this.#decorateDialog({
      action,
      data: {
        id: '',
        name: '',
        description: '',
        thumbnail: blankImage
      }
    });

    this.#clearInvalid(form);
  }

  _onDialogsClose(evt) {
    const { target } = evt;
    const dialog = target.closest('msc-dialogs');
    const action = target.className.replace(/.*-(.*)/, '$1');

    switch (action) {
      case 'drive': {
        const { dialogEdit, dialogDelete } = this.#nodes;

        if (dialogEdit.open) {
          dialogEdit.close();
        }

        if (dialogDelete.open) {
          dialogDelete.close();
        }
        break;
      }

      case 'delete':
      case 'edit': {
        // wait dialog hide
        setTimeout(
          () => {
            this.#resetForm(dialog);
          }
        , 400);
        break;
      }
    }
  }

  #clearInvalid(form) {
    Array.from(form.querySelectorAll('.input-set__em'))
      .forEach((warn) => warn.textContent = '');
  }

  #getWarnElement(target) {
    return target
      .closest('.input-set')
      .querySelector('.input-set__em');
  }

  async _editHandler(evt) {
    evt.preventDefault();

    const { type, target, submitter } = evt;
    const { dialogEdit, formEdit } = this.#nodes;
    const warnContent = 'Input title please.';

    switch (type) {
      case 'input': {
        const input = target.closest('input,textarea');
        const warn = this.#getWarnElement(input);
        const filled = !!input.value.trim().length;

        // check name only
        if (input.dataset.ref === 'name') {
          warn.textContent = filled ? '' : warnContent;
        }
        break;
      }

      case 'submit': {
        this.#clearInvalid(formEdit);

        if (submitter.value === 'cancel') {
          dialogEdit.close();
          return;
        }

        const formData = new FormData(formEdit);
        const fd = Object.fromEntries(formData.entries());
        const filled = !!fd['title'].trim().length;

        if (!filled) {
          const warn = this.#getWarnElement(formEdit.querySelector('[data-ref=name]'));
          warn.textContent = warnContent;
          return;
        }
        
        // TODO: fetch edit api

        const id = fd['id'];
        if (this.#data.listings[id]) {
          this.#data.listings[id] = {
            ...this.#data.listings[id],
            name: fd['title'].trim(),
            description: fd['description'].trim()
          };
        }

        dialogEdit.close();
        break;
      }
    }
  }

  async _deleteHandler(evt) {
    evt.preventDefault();

    const { submitter } = evt;
    const { dialogDelete, formDelete } = this.#nodes;
    const formData = new FormData(formDelete);
    const fd = Object.fromEntries(formData.entries());
    const { id } = fd;
    const action = submitter.value;

    switch (action) {
      case 'cancel': {
        dialogDelete.close();
        break;
      }

      case 'submit': {
        // TODO: fetch delete api

        this.#deleteUnit(id);

        dialogDelete.close();
        break;
      }
    }
  }

  _onSearchInput() {
    const { formSearch, gallery } = this.#nodes;
    const formData = new FormData(formSearch);
    const fd = Object.fromEntries(formData.entries());
    const q = fd['q'].toLowerCase().trim();
    const bypass = !q.length ? true : false;

    const pool = this.#data.orders.reduce(
      (acc, id) => {
        const data = this.#data.listings[id];

        if (!data) {
          return acc;
        } else {
          const { status } = data;

          return acc.concat({
            ...data,
            freeze: status === 'done' ? false : true
          });
        }
      }
    , []);

    gallery.replaceChildren();

    const units = pool.filter(
      ({ name, description }) => {
        return bypass
          || name.toLowerCase().includes(q)
          || description.toLowerCase().includes(q);
      }
    );

    if (units.length) {
      const unitsString = Mustache.render(templateUnit.innerHTML, { units });
      gallery.insertAdjacentHTML('afterbegin', unitsString);
    }

    this.#checkBtnPick();
  }

  _onSubmit(evt) {
    evt.preventDefault();

    const { formDriveMain } = this.#nodes;
    const formData = new FormData(formDriveMain);
    const ids = formData.getAll('pickedVideoIds');

    if (!ids.length) {
      return;
    }

    const picked = ids.reduce(
      (acc, id) => {
        const { result } = this.#data.listings?.[id] || {};

        return !result
          ? acc
          : acc.concat({ ...result });
      }
    , []);

    this.#fireEvent(custumEvents.pick, { picked });
    this.close();
  }

  _onPick(evt) {
    const input = evt.target.closest('input');
    const { formDriveMain, infoPickCount } = this.#nodes;
    let pickedCount = new FormData(formDriveMain).getAll('pickedVideoIds').length;

    // revert input
    if (pickedCount > this.maxpickcount) {
      input.checked = false;
      pickedCount--;
    }

    infoPickCount.textContent = pickedCount;
    this.#checkBtnPick();
  }

  #checkBtnPick() {
    const { formDriveMain, btnPick } = this.#nodes;
    const formData = new FormData(formDriveMain);
    const ids = formData.getAll('pickedVideoIds');

    btnPick.inert = ids.length > 0 ? false : true;
  }

  #checkUploadCount() {
    const { uploader, gallery } = this.#nodes;
    const count = Array.from(gallery.querySelectorAll('[data-status=done]')).length;

    uploader.inert = count > this.maxuploadcount;
  }

  _onDnD(evt) {
    const { type } = evt;
    const { drive, uploader } = this.#nodes;

    switch (type) {
      case 'dragover': {
        evt.preventDefault();
        break;
      }

      case 'drop': {
        const { dataTransfer } = evt;

        evt.preventDefault();

        this.#data.dragCount = 0;
        
        if (uploader.inert) {
          return;
        }

        drive.classList.toggle('drive--over', false);
        uploader.passFiles(dataTransfer.files);
        break;
      }

      case 'paste': {
        const dataTransfer = evt.clipboardData || window.clipboardData;

        document.body.focus();

        if (uploader.inert) {
          return;
        }

        uploader.passFiles(dataTransfer.files);
        break;
      }
    }
  }

  _hintHandler(evt) {
    const { type } = evt;
    const { drive, uploader } = this.#nodes;

    switch (type) {
      case 'dragenter': {
        this.#data.dragCount++;
      }

      case 'dragover': {
        if (this.open && !uploader.inert) {
          drive.classList.toggle('drive--over', true);
        }
        break;
      }

      case 'dragleave': {
        if (isSafari) {
          this.#data.dragCount--;

          if (this.#data.dragCount === 0) {
            drive.classList.toggle('drive--over', false);
          }
        } else {
          drive.classList.toggle('drive--over', false);
        }
        break;
      }
    }
  }

  close() {
    this.#nodes.dialogDrive.close();
  }

  showModal() {
    this.#nodes.dialogDrive.showModal();
  }
}

// define web component
const S = _wcl.supports();
const T = _wcl.classToTagName('YahooPixelframeDrive');
if (S.customElements && S.shadowDOM && S.template && !window.customElements.get(T)) {
  window.customElements.define(_wcl.classToTagName('YahooPixelframeDrive'), YahooPixelframeDrive);
}