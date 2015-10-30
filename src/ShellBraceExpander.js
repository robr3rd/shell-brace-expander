"use strict"

/**
 * Accept a string that contains shell expansions and add it as the only item in the `expansions` array property.
 *
 * Example input: '/path/to/{file1,dir1/{file2,file3,dir2{/dir3,}/file4}}'
 *
 * @param {string} input String containing shell expansions
 */
var ShellBraceExpander = function(input){
	 this.expansions = [input];
	 this.expand();
};

/**
 * Recursively modify `expansions` array property until finished
 *
 * This method iterates over each item in the `expansions` array and `split(',')`s the first occurence of innermost...
 * ...expansions (i.e. an expansion set that has no child expansions) and creates a new array item for each result of...
 * ...the `split`. It then removes the current item from the array so that it doesn't get processed infinitely again.
 *
 * Once this method iterates through the whole array, it runs through it again, searching for additional expansions...
 * ...in each item. If one is found, the above process repeats (find innermost and split on each comma).
 *
 * This continues until the method is able to run through every item in the array and not locate any further expansions.
 *
 * Helpful Hint: Yes, the first iteration will only be on a single item. `this.expansions == input string` at that time.
 *
 * NOTE/TODO:
 * Currently the recursion logic is slightly flawed, as it will always execute one more time than it needs to, since...
 * ...it only stops when `hasChanges = True` for which it would need to iterate over the whole array and NOT find...
 * ...anything that needs modification. Maybe this is the best way, but then again maybe it's not.
 *
 * @return {boolean} True when complete
 */
ShellBraceExpander.prototype.expand = function() {
	var hasChanges = false;

	for (var i=0; i < this.expansions.length; i++) {
		var expansion = this.expansions[i];

		// Detect expansions in this array item
		if (expansion.indexOf('{') !== -1) {
			hasChanges = true;

			// Isolate the expansion from the rest of the string
			// Do this with backreferences to pre-/post-expansion content (in addition to the expansion content iteself)
			var innermostExpansion = expansion.match(/(.*?)\{([^{]*?)\}(.*)/), // Get innermost expansion set
				braceContents = innermostExpansion[2], // The contents of the expansion (e.g. "foo,bar/baz,qux/foo/bar")
				expanders = braceContents.split(',');

			for (var j=0; j < expanders.length; j++) {
				expansion = innermostExpansion[1] + expanders[j] + innermostExpansion[3];
				this.addExpansion(expansion);
			}

			// Remove the item we just did since we no longer need it
			this.expansions.splice(i, 1);
		}
	}

	// If something changed this time, there might be more! Run again!
	// (this is somewhat flawed in that it has to run once *without() changes to finish, which is a bit of a waste)
	if (hasChanges) {
		this.expand();
	} else {
		return true;
	}
};

/**
 * Add an element to the `expansions` array property
 *
 * @example ShellBraceExpander.addExpansion('/expanded/path/to/file');
 * @param {string} expansion Item to add to the expansions array property
 * @returns {boolean} True on success, False if expansion already exists
 */
ShellBraceExpander.prototype.addExpansion = function(expansion){
	// Prevent duplicates that arise from nested expansions
	// For example, this input: /path/to/{foo,bar/{a,b}}
	// Will give us:
	// - /path/to/{foo,bar/a}
	// - /path/to/{foo,bar/b}
	//
	// The next time we loop over this.exapsnions, we'll get:
	// - /path/to/foo
	// - /path/to/bar/a
	// and
	// - /path/to/foo
	// - /path/to/bar/b
	//
	// Notice the duplicate `/path/to/foo`
	if (this.expansions.indexOf(expansion) === -1) {
		this.expansions.push(expansion);
		return true;
	} else {
		return false;
	}
};

/**
 * Retrieve the expansions
 *
 * @param  {string} [format='array'] The output format (supported values: array, json, string)
 * @return {Array|Object|string} The value of the ShellBraceExpander.expansions array property in the specified format
 */
ShellBraceExpander.prototype.getExpansions = function(format){
	if (!format) {
		format = 'array';
	}

	switch (format) {
		case 'array':
			return this.expansions;
		case 'json':
			return JSON.stringify(this.expansions);
		case 'string':
			return this.expansions.join();
		default:
			return 'ShellBraceExpander.getExpansions::PARAMETER_ERROR: ' +
				'Unrecognized value ("' + format + '") passed for first parameter!';
	}
};

ShellBraceExpander.prototype.getExpansionsCount = function(){
	return this.expansions.length;
};
