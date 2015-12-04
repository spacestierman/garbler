var Garbler = function () {
	this._originals = [];
	this._interval = Garbler.NOT_RUNNING_INTERVAL_ID;
	this._intervalInMilliseconds = 10;
	this._garblesPerInterval = 1;
	this._garbleCharacters = this.buildCharactersArray(32, 126);
	this._$target = $(document.body);
};

Garbler.NOT_RUNNING_INTERVAL_ID = -1;

Garbler.prototype = {
	garble: function (intervalInMilliseconds, garblesPerInterval) {
		this.update(intervalInMilliseconds, garblesPerInterval);
		this.start();
	},

	update: function (intervalInMilliseconds, garblesPerInterval) {
		this._intervalInMilliseconds = intervalInMilliseconds;
		this._garblesPerInterval = garblesPerInterval;
	},

	start: function () {
		this.stop();
		this._interval = setInterval(this._changeRandomText.bind(this), this._intervalInMilliseconds);
	},

	stop: function () {
		if (this._interval != Garbler.NOT_RUNNING_INTERVAL_ID) {
			clearInterval(this._interval);
			this._interval = Garbler.NOT_RUNNING_INTERVAL_ID;
		}
	},

	reset: function () {
		for (var i = 0; i < this._originals.length; i++) {
			var item = this._originals[i];
			item.node.nodeValue = item.originalText;
		}
		this._originals = [];
	},

	isRunning: function () {
		return this._interval != Garbler.NOT_RUNNING_INTERVAL_ID
	},

	setGarbleCharacters: function (charactersArray) {
		this._garbleCharacters = charactersArray;
	},

	setTarget: function ($target) {
		this._$target = $target;
	},

	getIntervalInMilliseconds: function () {
		return this._intervalInMilliseconds;
	},

	getGarblesPerInterval: function () {
		return this._garblesPerInterval;
	},

	getTarget: function () {
		return this._$target;
	},

	buildCharactersArray: function (startCode, endCode) {
		var chars = [];
		for (var i = startCode; i <= endCode; i++) {
			chars.push(String.fromCharCode(i));
		}
		return chars;
	},

	_didWeAlreadyChangeNode: function (node) {
		for (var i = 0; i < this._originals.length; i++) {
			var changed = this._originals[i];
			if (changed.node === node) {
				return true;
			}
		}
		return false;
	},

	_changeRandomText: function () {
		for (var i = 0; i < this._garblesPerInterval; i++) {
			var $element = this._getRandomTextElementWithin(this._$target);
			if ($element) {
				var node = this._getRandomTextNodeWithCopy($element);
				var text = node.nodeValue;

				if (!this._didWeAlreadyChangeNode(node)) {
					this._originals.push({
						node: node,
						originalText: text
					});
				}

				var changeIndex = Math.floor(Math.random() * text.length);
				var changeTo = this._getRandomGarble();
				var changeFrom = text.substr(changeIndex, 1);

				text = this._replaceCharacterAt(text, changeIndex, changeTo);
				node.nodeValue = text;
			}
		}
	},

	_getRandomTextElementWithin: function ($element) {
		var textElements = this._getAllNestedTextElementsWithin($element);
		if (textElements.length <= 0) {
			return null;
		}

		var index = Math.floor(Math.random() * textElements.length);
		var $random = textElements[index];
		return $random;
	},

	_getAllNestedTextElementsWithin: function ($element) {
		var textElements = [];
		if (this._doesElementHaveText($element)) {
			textElements.push($element);
		}

		var allChildren = $element.find("*"); // Pulls ALL of the descendents, not just the immediate children.  Saves us from having to recursively call ourself to travel the DOM tree.
		for (var i = 0; i < allChildren.length; i++) {
			var child = allChildren[i];
			var $child = $(child);
			if (this._doesElementHaveText($child)) {
				textElements.push($child);
			}
		}

		return textElements;
	},

	_doesElementHaveText: function ($element) {
		var text = this._getTextNodesWithCopy($element);
		if (text == null || text.length <= 0) {
			return false;
		}

		return true;
	},

	_getRandomTextNodeWithCopy: function ($element) {
		var nodes = this._getTextNodesWithCopy($element);
		var index = Math.floor(Math.random() * nodes.length);
		return nodes[index];
	},

	_replaceCharacterAt: function (input, replaceAt, replaceWith) {
		var length = replaceWith.length;
		if (replaceWith.length <= 0) {
			length = 1; // If we're replacing with empty-string, we still need to remove the old character.  That's what this does.
		}

		var replaced = input.substr(0, replaceAt) + replaceWith + input.substr(replaceAt + length);
		return replaced;
	},

	_getTextNodesWithCopy: function ($element) {
		var nodes = this._getTextNodes($element);
		var nodesWithCopy = [];
		for (var i = 0; i < nodes.length; i++) {
			var node = nodes[i];
			var text = node.nodeValue;
			if (text != null) {
				text = text.trim();
				if (text.length > 0) {
					nodesWithCopy.push(node);
				}
			}
		}
		return nodesWithCopy;
	},

	_getTextNodes: function ($element) {
		var nodes = $element.contents().filter(function () {
			return this.nodeType == 3;
		});
		return nodes;
	},

	_getRandomGarble: function () {
		var index = Math.floor(Math.random() * this._garbleCharacters.length);
		return this._garbleCharacters[index];
	}
};