# Emoji Metadata

The best source of truth for emoji is the [Unicode.org page](https://unicode.org/emoji/charts/full-emoji-list.html).

This data was obtained by running this code in the console on the aforementioned page. It infers categories and subcategories from the table subheadings on the page.

```
category = ''
subcategory = ''
emoji = []
;[...document.querySelectorAll('tr')]
  .forEach((tr, idx) => {
    if (tr.firstChild.matches('.bighead')) {
      category = tr.textContent
    } else if (tr.firstChild.matches('.mediumhead')) {
      subcategory = tr.textContent
    } else if (tr.querySelector('td')) {
    	try {
    		const codeElt = tr.querySelector('.code')
    		const charsElt = tr.querySelector('.chars')
    		const nameElt = tr.querySelector('.name')
		  emoji.push ({
		  	code: codeElt.textContent,
		  	chars: charsElt.textContent,
		  	name: nameElt.textContent,
		  })
    	} catch(e) {
    	  console.log({codeElt, charsElt, nameElt}, idx, e)
    	}
    }
  })
w = window.open()
w.document.body.innerHTML = `<pre>${JSON.stringify(emoji, false, 2)}</pre>`
'done'
```
