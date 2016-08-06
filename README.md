


F! Companion Chrome/Opera Extension
==========
###### As of this time I am no longer working on this extension, if it breaks it breaks.
###### Currently supports: Fakku, Pururin & nHentai

**F! Companion** is an extension for Chrome and Opera that lets you download all the pages of a manga at the press of a button. Or alternatively just show you the link for each page if you would rather use another downloader.

This was and still is the main point of the extension, but version 0.4 and up has the added functionality of also utilizing the subscription system on Fakku and will notify you when there are new items available that you subscribe to, and can be displayed in the dropdown window of the extension.

#### Screenshot
![F! Companion Screenshot](http://imgur.com/VmFErMs.jpg "F! Companion Dropdown Screenshot")

## Download
* Latest Release Version: ~~[F! Companion -release.crx](https://github.com/Kayla355/F--Companion/blob/master/F!%20Companion%20-release.crx?raw=true)~~
* *Release version is currently not working, use the dev version if any.*
* Latest Dev Version: [F! Companion -dev.crx](https://github.com/Kayla355/F--Companion/blob/master/F!%20Companion%20-dev.crx?raw=true)

## Usage
### For Chrome Users
1. Download one of the above versions.
2. Extract it to a new empty folder. (Use [7-zip](http://www.7-zip.org/) if you can't extract)
3. Navigate to your extension page(chrome://extensions) and check the "Developer mode" box
4. Click the "Load unpacked extension..." button and navigate to the project folder, then select the folder you created in step #2 and hit ok.
5. The extension should now be loaded.  

### For Opera Users
1. Download one of the above versions.
2. Navigate to your extension page(opera://extensions).
3. Drag & drop the .crx file onto the page.
4. Press install to confirm the installation.  
5. The extension should now be loaded.

_\*On older versions of Chrome the Opera method will also work. While on newer versions the extension will be force disabled when the browser is restarted._

## Version
* Major Version 0.3.0:
  * Added option for Incognito Downloads. (Useful if you don't actually want your Downloads History to be pretty much unusable because of spam from the images being downloaded)
  * Added option for File Conflits. (Currently only Overwrite and Rename exist as I try to figure out how to gain more control over the 'conflictAction' event.)
  * Fixed issues when trying to create a folder containing one of the following characters, \/:*?"<>|
  * Added error messages when the server responded with an error when trying to grab links and info.
  * Removed some defunct code that was no longer necessary.
  * Fixed issues with grabbing the correct manga when browsing a random manga using /random
  * Added support for notifications (requires Cookies)
  * Added loading animation to indicate that the extension is working.(When grabbing notes for the first time it would feel like it was broken because it takes a decent amount of time)
  * Should be working again from the new layout change to Fakku.

* Minor version 0.3.4:
  * Quick fix to notifications not loading when certain characters where not filtered properly.

* Dev version 0.4.3.xx:
  * The icon will now say "DL or "Link", depending on what option you have set, when it is the action that will be taken when pressed.
  * Fixed an issue with removed(actually hidden...) items causing issues when loading in newer items at the top.
  * Added "endless" scrolling to the notifications, which means that it will now load older entries as you reach the bottom of the page.
  * Started storing the generated html page in localstorage which means it will now load close to instantanious as it will no longer have to generate new entries from stored data at every load.
  * The menu will now always be shown at the top even when scrolling.
  * Added filtering the notifications.(Currently only works for tags)
  * Fixed an issue where the loadingtrail would stick around when an error loading a manga occured. (Hopefully for good this time...)
  * Fixed the "dark skin" and "monster girl" tags not appearing properly nor linking properly
  * The popups from clicking things like download or remove will now go away after a period of time rather than only when clicking somewhere else.
  * Added tooltips to tags. (Might redo these using something like jqueryui as it would give me more control over the styling.)
  * Updated to make use of the Fakku API for most things, making the loading of new mangas quite a bit faster.
  * Time will now be updated internally for when a manga was uploaded.
  * Updated the look of the options page.
  * There will now be a popup asking if you would like to force a recache when a major version change has been detected.
  * Added "endless-scrolling", meaning that you can load more items when you reach the bottom of the page. Amount can be changed in options.
  * Added Pururin.com support for downloads!
  * Larger rewrite to improve the general speed of the extension as a result of re-enabling async requests, which also improved the speed of downloads.
  * New scrollbar apperance for notifications.
  * Changed the customization of the file & foldernames of files. Allowing for a greater control over the filenames created.
  * Added nhentai.net support for downloads!

[Full Changelog](https://github.com/Kayla355/F--Companion/blob/master/Changelog.txt)

## Contact
* E-mail: kayla355@gmail.com
