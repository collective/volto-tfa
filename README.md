# volto-tfa

This addon requires [pas.plugins.tfa](https://github.com/collective/pas.plugins.tfa) Plone addon plugin.

Add this addon to volto project, just update package.json:
```
"addons": [
    "@plone-collective/volto-tfa"
],

"dependencies": {
    "@plone-collective/volto-tfa": "*"
}
```

Go to `/tfa-preferences` and follow the on screen guidelines.

**Note**: In order for this addon to work, you need to create a Plone user. Zope manager admin/admin won't work

For more details refer [Setting up pas.plugins.tfa on Classic UI](https://github.com/collective/pas.plugins.tfa?tab=readme-ov-file#setting-up-2fa-in-classicui)