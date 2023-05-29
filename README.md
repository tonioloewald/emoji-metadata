# Emoji Metadata
## Includes fully-qualified v15.0 emoji

The best source of truth for emoji is the [Unicode.org text file](https://unicode.org/Public/emoji/latest/emoji-test.txt).

The data is obtained via the `update` script (`updata-from-source.mjs`).

## Changes from v1.0

Instead of `main` being set to `emoji-metadata.json` it is now set to the lighter-weight `emoji.js`.

> Only `fully-qualified` emoji are included.

Four versions of the data are provided (and it should be easy to add more):

### emoji.js

This is a simple array of emoji provided as an ES6 module.

Usage:

    import emoji from 'emoji-metadata'

The data looks like this:

    export default [
      {
        category: "Smileys & Emotion",
        subcategory: "face-smiling",
        chars: "😀",
        name: "grinning face"
      },
      {
        category: "Smileys & Emotion",
        subcategory: "face-smiling",
        chars: "😃",
        name: "grinning face with big eyes"
      },
      ...
    ]

### emoji-groups.json

This is a hierarchical structure of groups and subgroups.

It looks like this:

    [
      {
        "name": "Smileys & Emotion",
        "subGroups": [
          {
            "name": "face-smiling",
            "emoji": [
              {
                "codes": [
                  "U+1F600"
                ],
                "chars": "😀",
                "name": "grinning face"
              },
              ...
            ]
          },
          ...
        ],
      },
      ...
    ]

### emoji-metadata.json

This is the same data as emoji-groups, but flattened.

It looks like this:

    [
      {
        "category": "Smileys & Emotion",
        "subcategory": "face-smiling",
        "codes": [
          "U+1F600"
        ],
        "chars": "😀",
        "name": "grinning face"
      },
      {
        "category": "Smileys & Emotion",
        "subcategory": "face-smiling",
        "codes": [
          "U+1F603"
        ],
        "chars": "😃",
        "name": "grinning face with big eyes"
      },
      ...
    ]

The javascript version is obviously the most convenient to use. The hierarchical version
is the most efficient (unless you don't want the codes), while emoji-metadata strikes
a happy medium (and with on-the-fly compression is probably hardly larger than the
hierarchical version).

Finally, the version of the unicode data is stored in `emoji-version.json` in case that's helpful.