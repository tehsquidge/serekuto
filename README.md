serekuto
========

replaces a select element visually with a search box while still using it for the form submission. All searched content is kept within the original select element and the selected option is updated there too. When submitting the value of the original select element is sent.

Usage
========

```
$(select#my-list').serekuto();
```

the plugin will search two places - the text with the option and data-tags attribute. Example:

```
<option value="GB" data-tags="Scotland,England,Wales,Northern Ireland">United Kingdon</option>
```

Options
========

**placeholderText** - html5 placeholder text
```
$(select#my-list').serekuto({
  placeholderText: "Select a Country..."
});
```
**calculatePosition** - callback for customizing the position of the dropdown. return {top: x, left: y}. You can use this.searchBox to position from. Example:
```
$(select#my-list').serekuto({
  calculatePosition: function(){
	  return { top: this.searchBox.offset().top + this.searchBox.outerHeight(), left: this.searchBox.offset().left};
	}
});
```

