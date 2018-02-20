/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export createProperty */
/* unused harmony export whenAllDefined */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__lit_html_lib_lit_extended_js__ = __webpack_require__(2);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_0__lit_html_lib_lit_extended_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__lit_html_lit_html_js__ = __webpack_require__(1);
/* unused harmony reexport TemplateResult */



function createProperty(prototype, propertyName, options = {}) {
    if (!prototype.constructor.hasOwnProperty('properties')) {
        Object.defineProperty(prototype.constructor, 'properties', { value: {} });
    }
    prototype.constructor.properties[propertyName] = options;
    // Cannot attach from the decorator, won't override property.
    Promise.resolve().then(() => attachProperty(prototype, propertyName, options));
}
function attachProperty(prototype, propertyName, options) {
    const { type: typeFn, attrName } = options;
    function get() { return this.__values__[propertyName]; }
    function set(v) {
        // @ts-ignore
        let value = (v === null || v === undefined) ? v : (typeFn === Array ? v : typeFn(v));
        this._setPropertyValue(propertyName, value);
        if (attrName) {
            this._setAttributeValue(attrName, value, typeFn);
        }
        this.invalidate();
    }
    Object.defineProperty(prototype, propertyName, options.computed ? { get } : { get, set });
}
function whenAllDefined(result) {
    const template = result.template;
    const rootNode = template.element.content;
    const walker = document.createTreeWalker(rootNode, NodeFilter.SHOW_ELEMENT, null, false);
    const deps = new Set();
    while (walker.nextNode()) {
        const element = walker.currentNode;
        if (element.tagName.includes('-')) {
            deps.add(element.tagName.toLowerCase());
        }
    }
    return Promise.all(Array.from(deps).map(tagName => customElements.whenDefined(tagName)));
}
class LitElement extends HTMLElement {
    constructor() {
        super();
        this._needsRender = false;
        this._lookupCache = {};
        this._attrMap = {};
        this._deps = {};
        this.__values__ = {};
        this.attachShadow({ mode: 'open' });
        for (const propertyName in this.constructor.properties) {
            const options = this.constructor.properties[propertyName];
            const { value, attrName, computed } = options;
            // We can only handle properly defined attributes.
            if (typeof (attrName) === 'string' && attrName.length) {
                this._attrMap[attrName] = propertyName;
            }
            // Properties backed by attributes have default values set from attributes, not 'value'.
            if (!attrName && value !== undefined) {
                this._setPropertyValue(propertyName, value);
            }
            const match = /(\w+)\((.+)\)/.exec(computed);
            if (match) {
                const fnName = match[1];
                const targets = match[2].split(/,\s*/);
                const computeFn = () => {
                    const values = targets.map(target => this[target]);
                    if (this[fnName] && values.every(entry => entry !== undefined)) {
                        const computedValue = this[fnName].apply(this, values);
                        this._setPropertyValue(propertyName, computedValue);
                    }
                };
                for (const target of targets) {
                    if (!this._deps[target]) {
                        this._deps[target] = [computeFn];
                    }
                    else {
                        this._deps[target].push(computeFn);
                    }
                }
                computeFn();
            }
        }
    }
    _setPropertyValue(propertyName, newValue) {
        this.__values__[propertyName] = newValue;
        if (this._deps[propertyName]) {
            this._deps[propertyName].map((fn) => fn());
        }
    }
    _setPropertyValueFromAttributeValue(attrName, newValue) {
        const propertyName = this._attrMap[attrName];
        const { type: typeFn } = this.constructor.properties[propertyName];
        let value;
        if (typeFn.name === 'Boolean') {
            value = (newValue === '') || (!!newValue && newValue === attrName.toLowerCase());
        }
        else {
            value = (newValue !== null) ? typeFn(newValue) : undefined;
        }
        this._setPropertyValue(propertyName, value);
    }
    _setAttributeValue(attrName, value, typeFn) {
        // @ts-ignore
        if (typeFn.name === 'Boolean') {
            if (!value) {
                this.removeAttribute(attrName);
            }
            else {
                this.setAttribute(attrName, '');
            }
        }
        else {
            this.setAttribute(attrName, value);
        }
    }
    static get properties() {
        return {};
    }
    static get listeners() {
        return [];
    }
    static get observedAttributes() {
        return Object.keys(this.properties)
            .map(key => this.properties[key].attrName)
            .filter(name => name);
    }
    static withProperties() {
        for (const propertyName in this.properties) {
            attachProperty(this.prototype, propertyName, this.properties[propertyName]);
        }
        return this;
    }
    renderCallback() {
        Object(__WEBPACK_IMPORTED_MODULE_0__lit_html_lib_lit_extended_js__["b" /* render */])(this.render(this), this.shadowRoot);
    }
    // @ts-ignore
    render(self) {
        return __WEBPACK_IMPORTED_MODULE_0__lit_html_lib_lit_extended_js__["a" /* html */] ``;
    }
    attributeChangedCallback(attrName, _oldValue, newValue) {
        this._setPropertyValueFromAttributeValue(attrName, newValue);
        this.invalidate();
    }
    connectedCallback() {
        for (const attrName of this.constructor.observedAttributes) {
            this._setPropertyValueFromAttributeValue(attrName, this.getAttribute(attrName));
        }
        this.invalidate().then(() => {
            for (const listener of this.constructor.listeners) {
                const target = typeof listener.target === 'string' ? this.$(listener.target) : listener.target;
                target.addEventListener(listener.eventName, listener.handler.bind(this));
            }
        });
    }
    async invalidate() {
        if (!this._needsRender) {
            this._needsRender = true;
            // Schedule the following as micro task, which runs before
            // requestAnimationFrame. All additional invalidate() calls
            // before will be ignored.
            // https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/
            this._needsRender = await false;
            this.renderCallback();
        }
    }
    $(id) {
        let value = this._lookupCache[id];
        if (!value && this.shadowRoot) {
            const element = this.shadowRoot.getElementById(id);
            if (element) {
                value = element;
                this._lookupCache[id] = element;
            }
        }
        return value;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = LitElement;

//# sourceMappingURL=lit-element.js.map

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export defaultTemplateFactory */
/* harmony export (immutable) */ __webpack_exports__["g"] = render;
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
// The first argument to JS template tags retain identity across multiple
// calls to a tag for the same literal, so we can cache work done per literal
// in a Map.
const templateCaches = new Map();
/* unused harmony export templateCaches */

/**
 * Interprets a template literal as an HTML template that can efficiently
 * render to and update a container.
 */
const html = (strings, ...values) => new TemplateResult(strings, values, 'html');
/* unused harmony export html */

/**
 * Interprets a template literal as an SVG template that can efficiently
 * render to and update a container.
 */
const svg = (strings, ...values) => new SVGTemplateResult(strings, values, 'svg');
/* unused harmony export svg */

/**
 * The return type of `html`, which holds a Template and the values from
 * interpolated expressions.
 */
class TemplateResult {
    constructor(strings, values, type, partCallback = defaultPartCallback) {
        this.strings = strings;
        this.values = values;
        this.type = type;
        this.partCallback = partCallback;
    }
    /**
     * Returns a string of HTML used to create a <template> element.
     */
    getHTML() {
        const l = this.strings.length - 1;
        let html = '';
        let isTextBinding = true;
        for (let i = 0; i < l; i++) {
            const s = this.strings[i];
            html += s;
            // We're in a text position if the previous string closed its tags.
            // If it doesn't have any tags, then we use the previous text position
            // state.
            const closing = findTagClose(s);
            isTextBinding = closing > -1 ? closing < s.length : isTextBinding;
            html += isTextBinding ? nodeMarker : marker;
        }
        html += this.strings[l];
        return html;
    }
    getTemplateElement() {
        const template = document.createElement('template');
        template.innerHTML = this.getHTML();
        return template;
    }
}
/* harmony export (immutable) */ __webpack_exports__["c"] = TemplateResult;

/**
 * A TemplateResult for SVG fragments.
 *
 * This class wraps HTMl in an <svg> tag in order to parse its contents in the
 * SVG namespace, then modifies the template to remove the <svg> tag so that
 * clones only container the original fragment.
 */
class SVGTemplateResult extends TemplateResult {
    getHTML() {
        return `<svg>${super.getHTML()}</svg>`;
    }
    getTemplateElement() {
        const template = super.getTemplateElement();
        const content = template.content;
        const svgElement = content.firstChild;
        content.removeChild(svgElement);
        reparentNodes(content, svgElement.firstChild);
        return template;
    }
}
/* harmony export (immutable) */ __webpack_exports__["b"] = SVGTemplateResult;

/**
 * The default TemplateFactory which caches Templates keyed on
 * result.type and result.strings.
 */
function defaultTemplateFactory(result) {
    let templateCache = templateCaches.get(result.type);
    if (templateCache === undefined) {
        templateCache = new Map();
        templateCaches.set(result.type, templateCache);
    }
    let template = templateCache.get(result.strings);
    if (template === undefined) {
        template = new Template(result, result.getTemplateElement());
        templateCache.set(result.strings, template);
    }
    return template;
}
/**
 * Renders a template to a container.
 *
 * To update a container with new values, reevaluate the template literal and
 * call `render` with the new result.
 *
 * @param result a TemplateResult created by evaluating a template tag like
 *     `html` or `svg.
 * @param container A DOM parent to render to. The entire contents are either
 *     replaced, or efficiently updated if the same result type was previous
 *     rendered there.
 * @param templateFactory a function to create a Template or retreive one from
 *     cache.
 */
function render(result, container, templateFactory = defaultTemplateFactory) {
    const template = templateFactory(result);
    let instance = container.__templateInstance;
    // Repeat render, just call update()
    if (instance !== undefined && instance.template === template &&
        instance._partCallback === result.partCallback) {
        instance.update(result.values);
        return;
    }
    // First render, create a new TemplateInstance and append it
    instance =
        new TemplateInstance(template, result.partCallback, templateFactory);
    container.__templateInstance = instance;
    const fragment = instance._clone();
    instance.update(result.values);
    removeNodes(container, container.firstChild);
    container.appendChild(fragment);
}
/**
 * An expression marker with embedded unique key to avoid collision with
 * possible text in templates.
 */
const marker = `{{lit-${String(Math.random()).slice(2)}}}`;
/**
 * An expression marker used text-posisitions, not attribute positions,
 * in template.
 */
const nodeMarker = `<!--${marker}-->`;
const markerRegex = new RegExp(`${marker}|${nodeMarker}`);
/**
 * This regex extracts the attribute name preceding an attribute-position
 * expression. It does this by matching the syntax allowed for attributes
 * against the string literal directly preceding the expression, assuming that
 * the expression is in an attribute-value position.
 *
 * See attributes in the HTML spec:
 * https://www.w3.org/TR/html5/syntax.html#attributes-0
 *
 * "\0-\x1F\x7F-\x9F" are Unicode control characters
 *
 * " \x09\x0a\x0c\x0d" are HTML space characters:
 * https://www.w3.org/TR/html5/infrastructure.html#space-character
 *
 * So an attribute is:
 *  * The name: any character except a control character, space character, ('),
 *    ("), ">", "=", or "/"
 *  * Followed by zero or more space characters
 *  * Followed by "="
 *  * Followed by zero or more space characters
 *  * Followed by:
 *    * Any character except space, ('), ("), "<", ">", "=", (`), or
 *    * (") then any non-("), or
 *    * (') then any non-(')
 */
const lastAttributeNameRegex = /[ \x09\x0a\x0c\x0d]([^\0-\x1F\x7F-\x9F \x09\x0a\x0c\x0d"'>=/]+)[ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*)$/;
/**
 * Finds the closing index of the last closed HTML tag.
 * This has 3 possible return values:
 *   - `-1`, meaning there is no tag in str.
 *   - `string.length`, meaning the last opened tag is unclosed.
 *   - Some positive number < str.length, meaning the index of the closing '>'.
 */
function findTagClose(str) {
    const close = str.lastIndexOf('>');
    const open = str.indexOf('<', close + 1);
    return open > -1 ? str.length : close;
}
/**
 * A placeholder for a dynamic expression in an HTML template.
 *
 * There are two built-in part types: AttributePart and NodePart. NodeParts
 * always represent a single dynamic expression, while AttributeParts may
 * represent as many expressions are contained in the attribute.
 *
 * A Template's parts are mutable, so parts can be replaced or modified
 * (possibly to implement different template semantics). The contract is that
 * parts can only be replaced, not removed, added or reordered, and parts must
 * always consume the correct number of values in their `update()` method.
 *
 * TODO(justinfagnani): That requirement is a little fragile. A
 * TemplateInstance could instead be more careful about which values it gives
 * to Part.update().
 */
class TemplatePart {
    constructor(type, index, name, rawName, strings) {
        this.type = type;
        this.index = index;
        this.name = name;
        this.rawName = rawName;
        this.strings = strings;
    }
}
/* unused harmony export TemplatePart */

/**
 * An updateable Template that tracks the location of dynamic parts.
 */
class Template {
    constructor(result, element) {
        this.parts = [];
        this.element = element;
        const content = this.element.content;
        // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be null
        const walker = document.createTreeWalker(content, 133 /* NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT |
               NodeFilter.SHOW_TEXT */, null, false);
        let index = -1;
        let partIndex = 0;
        const nodesToRemove = [];
        // The actual previous node, accounting for removals: if a node is removed
        // it will never be the previousNode.
        let previousNode;
        // Used to set previousNode at the top of the loop.
        let currentNode;
        while (walker.nextNode()) {
            index++;
            previousNode = currentNode;
            const node = currentNode = walker.currentNode;
            if (node.nodeType === 1 /* Node.ELEMENT_NODE */) {
                if (!node.hasAttributes()) {
                    continue;
                }
                const attributes = node.attributes;
                // Per https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap,
                // attributes are not guaranteed to be returned in document order. In
                // particular, Edge/IE can return them out of order, so we cannot assume
                // a correspondance between part index and attribute index.
                let count = 0;
                for (let i = 0; i < attributes.length; i++) {
                    if (attributes[i].value.indexOf(marker) >= 0) {
                        count++;
                    }
                }
                while (count-- > 0) {
                    // Get the template literal section leading up to the first
                    // expression in this attribute attribute
                    const stringForPart = result.strings[partIndex];
                    // Find the attribute name
                    const attributeNameInPart = lastAttributeNameRegex.exec(stringForPart)[1];
                    // Find the corresponding attribute
                    const attribute = attributes.getNamedItem(attributeNameInPart);
                    const stringsForAttributeValue = attribute.value.split(markerRegex);
                    this.parts.push(new TemplatePart('attribute', index, attribute.name, attributeNameInPart, stringsForAttributeValue));
                    node.removeAttribute(attribute.name);
                    partIndex += stringsForAttributeValue.length - 1;
                }
            }
            else if (node.nodeType === 3 /* Node.TEXT_NODE */) {
                const nodeValue = node.nodeValue;
                if (nodeValue.indexOf(marker) < 0) {
                    continue;
                }
                const parent = node.parentNode;
                const strings = nodeValue.split(markerRegex);
                const lastIndex = strings.length - 1;
                // We have a part for each match found
                partIndex += lastIndex;
                // We keep this current node, but reset its content to the last
                // literal part. We insert new literal nodes before this so that the
                // tree walker keeps its position correctly.
                node.textContent = strings[lastIndex];
                // Generate a new text node for each literal section
                // These nodes are also used as the markers for node parts
                for (let i = 0; i < lastIndex; i++) {
                    parent.insertBefore(document.createTextNode(strings[i]), node);
                    this.parts.push(new TemplatePart('node', index++));
                }
            }
            else if (node.nodeType === 8 /* Node.COMMENT_NODE */ &&
                node.nodeValue === marker) {
                const parent = node.parentNode;
                // Add a new marker node to be the startNode of the Part if any of the
                // following are true:
                //  * We don't have a previousSibling
                //  * previousSibling is being removed (thus it's not the
                //    `previousNode`)
                //  * previousSibling is not a Text node
                //
                // TODO(justinfagnani): We should be able to use the previousNode here
                // as the marker node and reduce the number of extra nodes we add to a
                // template. See https://github.com/PolymerLabs/lit-html/issues/147
                const previousSibling = node.previousSibling;
                if (previousSibling === null || previousSibling !== previousNode ||
                    previousSibling.nodeType !== Node.TEXT_NODE) {
                    parent.insertBefore(document.createTextNode(''), node);
                }
                else {
                    index--;
                }
                this.parts.push(new TemplatePart('node', index++));
                nodesToRemove.push(node);
                // If we don't have a nextSibling add a marker node.
                // We don't have to check if the next node is going to be removed,
                // because that node will induce a new marker if so.
                if (node.nextSibling === null) {
                    parent.insertBefore(document.createTextNode(''), node);
                }
                else {
                    index--;
                }
                currentNode = previousNode;
                partIndex++;
            }
        }
        // Remove text binding nodes after the walk to not disturb the TreeWalker
        for (const n of nodesToRemove) {
            n.parentNode.removeChild(n);
        }
    }
}
/* unused harmony export Template */

/**
 * Returns a value ready to be inserted into a Part from a user-provided value.
 *
 * If the user value is a directive, this invokes the directive with the given
 * part. If the value is null, it's converted to undefined to work better
 * with certain DOM APIs, like textContent.
 */
const getValue = (part, value) => {
    // `null` as the value of a Text node will render the string 'null'
    // so we convert it to undefined
    if (isDirective(value)) {
        value = value(part);
        return directiveValue;
    }
    return value === null ? undefined : value;
};
/* harmony export (immutable) */ __webpack_exports__["f"] = getValue;

const directive = (f) => {
    f.__litDirective = true;
    return f;
};
/* unused harmony export directive */

const isDirective = (o) => typeof o === 'function' && o.__litDirective === true;
/**
 * A sentinel value that signals that a value was handled by a directive and
 * should not be written to the DOM.
 */
const directiveValue = {};
/* harmony export (immutable) */ __webpack_exports__["e"] = directiveValue;

const isPrimitiveValue = (value) => value === null ||
    !(typeof value === 'object' || typeof value === 'function');
class AttributePart {
    constructor(instance, element, name, strings) {
        this.instance = instance;
        this.element = element;
        this.name = name;
        this.strings = strings;
        this.size = strings.length - 1;
        this._previousValues = [];
    }
    _interpolate(values, startIndex) {
        const strings = this.strings;
        const l = strings.length - 1;
        let text = '';
        for (let i = 0; i < l; i++) {
            text += strings[i];
            const v = getValue(this, values[startIndex + i]);
            if (v && v !== directiveValue &&
                (Array.isArray(v) || typeof v !== 'string' && v[Symbol.iterator])) {
                for (const t of v) {
                    // TODO: we need to recursively call getValue into iterables...
                    text += t;
                }
            }
            else {
                text += v;
            }
        }
        return text + strings[l];
    }
    _equalToPreviousValues(values, startIndex) {
        for (let i = startIndex; i < startIndex + this.size; i++) {
            if (this._previousValues[i] !== values[i] ||
                !isPrimitiveValue(values[i])) {
                return false;
            }
        }
        return true;
    }
    setValue(values, startIndex) {
        if (this._equalToPreviousValues(values, startIndex)) {
            return;
        }
        const s = this.strings;
        let value;
        if (s.length === 2 && s[0] === '' && s[1] === '') {
            // An expression that occupies the whole attribute value will leave
            // leading and trailing empty strings.
            value = getValue(this, values[startIndex]);
            if (Array.isArray(value)) {
                value = value.join('');
            }
        }
        else {
            value = this._interpolate(values, startIndex);
        }
        if (value !== directiveValue) {
            this.element.setAttribute(this.name, value);
        }
        this._previousValues = values;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AttributePart;

class NodePart {
    constructor(instance, startNode, endNode) {
        this.instance = instance;
        this.startNode = startNode;
        this.endNode = endNode;
        this._previousValue = undefined;
    }
    setValue(value) {
        value = getValue(this, value);
        if (value === directiveValue) {
            return;
        }
        if (isPrimitiveValue(value)) {
            // Handle primitive values
            // If the value didn't change, do nothing
            if (value === this._previousValue) {
                return;
            }
            this._setText(value);
        }
        else if (value instanceof TemplateResult) {
            this._setTemplateResult(value);
        }
        else if (Array.isArray(value) || value[Symbol.iterator]) {
            this._setIterable(value);
        }
        else if (value instanceof Node) {
            this._setNode(value);
        }
        else if (value.then !== undefined) {
            this._setPromise(value);
        }
        else {
            // Fallback, will render the string representation
            this._setText(value);
        }
    }
    _insert(node) {
        this.endNode.parentNode.insertBefore(node, this.endNode);
    }
    _setNode(value) {
        if (this._previousValue === value) {
            return;
        }
        this.clear();
        this._insert(value);
        this._previousValue = value;
    }
    _setText(value) {
        const node = this.startNode.nextSibling;
        value = value === undefined ? '' : value;
        if (node === this.endNode.previousSibling &&
            node.nodeType === Node.TEXT_NODE) {
            // If we only have a single text node between the markers, we can just
            // set its value, rather than replacing it.
            // TODO(justinfagnani): Can we just check if _previousValue is
            // primitive?
            node.textContent = value;
        }
        else {
            this._setNode(document.createTextNode(value));
        }
        this._previousValue = value;
    }
    _setTemplateResult(value) {
        const template = this.instance._getTemplate(value);
        let instance;
        if (this._previousValue && this._previousValue.template === template) {
            instance = this._previousValue;
        }
        else {
            instance = new TemplateInstance(template, this.instance._partCallback, this.instance._getTemplate);
            this._setNode(instance._clone());
            this._previousValue = instance;
        }
        instance.update(value.values);
    }
    _setIterable(value) {
        // For an Iterable, we create a new InstancePart per item, then set its
        // value to the item. This is a little bit of overhead for every item in
        // an Iterable, but it lets us recurse easily and efficiently update Arrays
        // of TemplateResults that will be commonly returned from expressions like:
        // array.map((i) => html`${i}`), by reusing existing TemplateInstances.
        // If _previousValue is an array, then the previous render was of an
        // iterable and _previousValue will contain the NodeParts from the previous
        // render. If _previousValue is not an array, clear this part and make a new
        // array for NodeParts.
        if (!Array.isArray(this._previousValue)) {
            this.clear();
            this._previousValue = [];
        }
        // Lets us keep track of how many items we stamped so we can clear leftover
        // items from a previous render
        const itemParts = this._previousValue;
        let partIndex = 0;
        for (const item of value) {
            // Try to reuse an existing part
            let itemPart = itemParts[partIndex];
            // If no existing part, create a new one
            if (itemPart === undefined) {
                // If we're creating the first item part, it's startNode should be the
                // container's startNode
                let itemStart = this.startNode;
                // If we're not creating the first part, create a new separator marker
                // node, and fix up the previous part's endNode to point to it
                if (partIndex > 0) {
                    const previousPart = itemParts[partIndex - 1];
                    itemStart = previousPart.endNode = document.createTextNode('');
                    this._insert(itemStart);
                }
                itemPart = new NodePart(this.instance, itemStart, this.endNode);
                itemParts.push(itemPart);
            }
            itemPart.setValue(item);
            partIndex++;
        }
        if (partIndex === 0) {
            this.clear();
            this._previousValue = undefined;
        }
        else if (partIndex < itemParts.length) {
            const lastPart = itemParts[partIndex - 1];
            // Truncate the parts array so _previousValue reflects the current state
            itemParts.length = partIndex;
            this.clear(lastPart.endNode.previousSibling);
            lastPart.endNode = this.endNode;
        }
    }
    _setPromise(value) {
        this._previousValue = value;
        value.then((v) => {
            if (this._previousValue === value) {
                this.setValue(v);
            }
        });
    }
    clear(startNode = this.startNode) {
        removeNodes(this.startNode.parentNode, startNode.nextSibling, this.endNode);
    }
}
/* unused harmony export NodePart */

const defaultPartCallback = (instance, templatePart, node) => {
    if (templatePart.type === 'attribute') {
        return new AttributePart(instance, node, templatePart.name, templatePart.strings);
    }
    else if (templatePart.type === 'node') {
        return new NodePart(instance, node, node.nextSibling);
    }
    throw new Error(`Unknown part type ${templatePart.type}`);
};
/* harmony export (immutable) */ __webpack_exports__["d"] = defaultPartCallback;

/**
 * An instance of a `Template` that can be attached to the DOM and updated
 * with new values.
 */
class TemplateInstance {
    constructor(template, partCallback, getTemplate) {
        this._parts = [];
        this.template = template;
        this._partCallback = partCallback;
        this._getTemplate = getTemplate;
    }
    update(values) {
        let valueIndex = 0;
        for (const part of this._parts) {
            if (part.size === undefined) {
                part.setValue(values[valueIndex]);
                valueIndex++;
            }
            else {
                part.setValue(values, valueIndex);
                valueIndex += part.size;
            }
        }
    }
    _clone() {
        const fragment = document.importNode(this.template.element.content, true);
        const parts = this.template.parts;
        if (parts.length > 0) {
            // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be
            // null
            const walker = document.createTreeWalker(fragment, 133 /* NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT |
                   NodeFilter.SHOW_TEXT */, null, false);
            let index = -1;
            for (let i = 0; i < parts.length; i++) {
                const part = parts[i];
                while (index < part.index) {
                    index++;
                    walker.nextNode();
                }
                this._parts.push(this._partCallback(this, part, walker.currentNode));
            }
        }
        return fragment;
    }
}
/* unused harmony export TemplateInstance */

/**
 * Reparents nodes, starting from `startNode` (inclusive) to `endNode`
 * (exclusive), into another container (could be the same container), before
 * `beforeNode`. If `beforeNode` is null, it appends the nodes to the
 * container.
 */
const reparentNodes = (container, start, end = null, before = null) => {
    let node = start;
    while (node !== end) {
        const n = node.nextSibling;
        container.insertBefore(node, before);
        node = n;
    }
};
/* unused harmony export reparentNodes */

/**
 * Removes nodes, starting from `startNode` (inclusive) to `endNode`
 * (exclusive), from `container`.
 */
const removeNodes = (container, startNode, endNode = null) => {
    let node = startNode;
    while (node !== endNode) {
        const n = node.nextSibling;
        container.removeChild(node);
        node = n;
    }
};
/* unused harmony export removeNodes */

//# sourceMappingURL=lit-html.js.map

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__lit_html_js__ = __webpack_require__(1);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_0__lit_html_js__["g"]; });
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */


/**
 * Interprets a template literal as a lit-extended HTML template.
 */
const html = (strings, ...values) => new __WEBPACK_IMPORTED_MODULE_0__lit_html_js__["c" /* TemplateResult */](strings, values, 'html', extendedPartCallback);
/* harmony export (immutable) */ __webpack_exports__["a"] = html;

/**
 * Interprets a template literal as a lit-extended SVG template.
 */
const svg = (strings, ...values) => new __WEBPACK_IMPORTED_MODULE_0__lit_html_js__["b" /* SVGTemplateResult */](strings, values, 'svg', extendedPartCallback);
/* unused harmony export svg */

/**
 * A PartCallback which allows templates to set properties and declarative
 * event handlers.
 *
 * Properties are set by default, instead of attributes. Attribute names in
 * lit-html templates preserve case, so properties are case sensitive. If an
 * expression takes up an entire attribute value, then the property is set to
 * that value. If an expression is interpolated with a string or other
 * expressions then the property is set to the string result of the
 * interpolation.
 *
 * To set an attribute instead of a property, append a `$` suffix to the
 * attribute name.
 *
 * Example:
 *
 *     html`<button class$="primary">Buy Now</button>`
 *
 * To set an event handler, prefix the attribute name with `on-`:
 *
 * Example:
 *
 *     html`<button on-click=${(e)=> this.onClickHandler(e)}>Buy Now</button>`
 *
 */
const extendedPartCallback = (instance, templatePart, node) => {
    if (templatePart.type === 'attribute') {
        if (templatePart.rawName.startsWith('on-')) {
            const eventName = templatePart.rawName.slice(3);
            return new EventPart(instance, node, eventName);
        }
        if (templatePart.name.endsWith('$')) {
            const name = templatePart.name.slice(0, -1);
            return new __WEBPACK_IMPORTED_MODULE_0__lit_html_js__["a" /* AttributePart */](instance, node, name, templatePart.strings);
        }
        if (templatePart.name.endsWith('?')) {
            const name = templatePart.name.slice(0, -1);
            return new BooleanAttributePart(instance, node, name, templatePart.strings);
        }
        return new PropertyPart(instance, node, templatePart.rawName, templatePart.strings);
    }
    return Object(__WEBPACK_IMPORTED_MODULE_0__lit_html_js__["d" /* defaultPartCallback */])(instance, templatePart, node);
};
/* unused harmony export extendedPartCallback */

/**
 * Implements a boolean attribute, roughly as defined in the HTML
 * specification.
 *
 * If the value is truthy, then the attribute is present with a value of
 * ''. If the value is falsey, the attribute is removed.
 */
class BooleanAttributePart extends __WEBPACK_IMPORTED_MODULE_0__lit_html_js__["a" /* AttributePart */] {
    setValue(values, startIndex) {
        const s = this.strings;
        if (s.length === 2 && s[0] === '' && s[1] === '') {
            const value = Object(__WEBPACK_IMPORTED_MODULE_0__lit_html_js__["f" /* getValue */])(this, values[startIndex]);
            if (value === __WEBPACK_IMPORTED_MODULE_0__lit_html_js__["e" /* directiveValue */]) {
                return;
            }
            if (value) {
                this.element.setAttribute(this.name, '');
            }
            else {
                this.element.removeAttribute(this.name);
            }
        }
        else {
            throw new Error('boolean attributes can only contain a single expression');
        }
    }
}
/* unused harmony export BooleanAttributePart */

class PropertyPart extends __WEBPACK_IMPORTED_MODULE_0__lit_html_js__["a" /* AttributePart */] {
    setValue(values, startIndex) {
        const s = this.strings;
        let value;
        if (this._equalToPreviousValues(values, startIndex)) {
            return;
        }
        if (s.length === 2 && s[0] === '' && s[1] === '') {
            // An expression that occupies the whole attribute value will leave
            // leading and trailing empty strings.
            value = Object(__WEBPACK_IMPORTED_MODULE_0__lit_html_js__["f" /* getValue */])(this, values[startIndex]);
        }
        else {
            // Interpolation, so interpolate
            value = this._interpolate(values, startIndex);
        }
        if (value !== __WEBPACK_IMPORTED_MODULE_0__lit_html_js__["e" /* directiveValue */]) {
            this.element[this.name] = value;
        }
        this._previousValues = values;
    }
}
/* unused harmony export PropertyPart */

class EventPart {
    constructor(instance, element, eventName) {
        this.instance = instance;
        this.element = element;
        this.eventName = eventName;
    }
    setValue(value) {
        const listener = Object(__WEBPACK_IMPORTED_MODULE_0__lit_html_js__["f" /* getValue */])(this, value);
        const previous = this._listener;
        if (listener === previous) {
            return;
        }
        this._listener = listener;
        if (previous != null) {
            this.element.removeEventListener(this.eventName, previous);
        }
        if (listener != null) {
            this.element.addEventListener(this.eventName, listener);
        }
    }
}
/* unused harmony export EventPart */

//# sourceMappingURL=lit-extended.js.map

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vendor_lit_html_element_lit_element_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__tngg_exit_js__ = __webpack_require__(9);



class TnggCard extends __WEBPACK_IMPORTED_MODULE_0__vendor_lit_html_element_lit_element_js__["a" /* LitElement */] {
  static get is() {
    return "tngg-card";
  }

  static get properties() {
    return {
      banner: {
        type: Boolean,
        attrName: "banner"
      },
      image: {
        type: String,
        attrName: "image"
      },
      bold: {
        type: Boolean,
        attrName: "bold"
      },
      open: {
        type: Boolean,
        attrName: "open"
      },
      nonopenable: {
        type: Boolean,
        attrName: "nonopenable"
      }
    }
  }

  constructor() {
    super();
    this.needsImages = true;
  }

  render() {
    return __WEBPACK_IMPORTED_MODULE_0__vendor_lit_html_element_lit_element_js__["b" /* html */]`
      ${this._styles()}
      <div class$="card ${this.bold ? 'bold' : ''} ${this.image ? '' : 'no-image'} ${this.nonopenable ? 'nonopenable' : 'openable'}"
           on-click=${() => this.nonopenable ? '' : this.openCard()}>
        ${this._top()}
        ${this._bottom()}
      </div>
      <div class$="open-view ${this.open ? 'open' : ''} ${this.image ? '' : 'no-image'}">
        <div class="open-wrapper">
          <tngg-exit on-click=${() => this.closeCard()}></tngg-exit>
          <div class="open-container">
            <slot name="opened">
          </div>
        </div>
      </div>
    `;
  }

  _top() {
    if (this.banner) {
      return '';
    } else {
      return __WEBPACK_IMPORTED_MODULE_0__vendor_lit_html_element_lit_element_js__["b" /* html */]`
        <div class="card-top">
          <div class="card-header">
            <slot name="title"></slot>
          </div>
          ${this.image ? __WEBPACK_IMPORTED_MODULE_0__vendor_lit_html_element_lit_element_js__["b" /* html */]`<img data-src$=${this.image}>` : ''}
        </div>
      `;
    }
  }

  _bottom() {
    return __WEBPACK_IMPORTED_MODULE_0__vendor_lit_html_element_lit_element_js__["b" /* html */]`
      <div class="card-bottom">
        <slot name="message"></slot>
      </div>
    `;
  }

  renderCallback() {
    super.renderCallback();
    if (this.needsImages) {
      this._loadImages();
    }
  }

  openCard(event) {
    var card = this.shadowRoot.querySelector(".card")
    var openView = this.shadowRoot.querySelector(".open-view")
    var save = { };
    this._rect = card.getBoundingClientRect();
    this.open = true;

    var viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    document.querySelector("body").style.height = viewportHeight+"px";
    document.querySelector("body").style.overflow = "hidden";

    openView.style.display = "block";
    openView.style.position = "fixed";
    openView.style.top = this._rect.top + "px";
    openView.style.left = this._rect.left + "px";
    openView.style.width = this._rect.width + "px";
    openView.style.height = this._rect.height + "px";
    openView.style.zIndex = "100";

    setTimeout(() => {
      openView.style.width = window.innerWidth + "px";
      openView.style.height = window.innerHeight + "px";
      openView.style.left = "0";
      openView.style.top = "0";

      setTimeout(() => {
        openView.style.width = "100%";
        openView.style.height = "100%";
      }, 225);
    }, 225);
  }

  closeCard(event) {
    var openView = this.shadowRoot.querySelector(".open-view")

    document.querySelector("body").style.height = "initial";
    document.querySelector("body").style.overflow = "initial";

    openView.style.display = "block";
    openView.style.position = "fixed";
    openView.style.top = this._rect.top + "px";
    openView.style.left = this._rect.left + "px";
    openView.style.width = this._rect.width + "px";
    openView.style.height = this._rect.height + "px";
    openView.style.zIndex = "100";

    setTimeout(() => {
      openView.style.height = "0";
      this.open = false;
      setTimeout(() => {
      }, 225)
    }, 225)
  }

  _loadImages() {
    if (! this.image) return;

    var openImgLoader = new Image();
    var cardImgLoader = new Image();
    var rect = this.getBoundingClientRect();
    var extensionIndex = this.image.lastIndexOf(".");
    var openImgType = window.isMobile ? ".mobile" : ".desktop";
    var cardImgType = rect.width > 500 ? ".wide" : openImgType;
    var cardImgSrc = this.image.substring(0, extensionIndex) + cardImgType + this.image.substring(extensionIndex);
    var openImgSrc = this.image.substring(0, extensionIndex) + openImgType + this.image.substring(extensionIndex);

    openImgLoader.onload = () => {
      this.shadowRoot.querySelector(".open-view").style.background = "url("+openImgSrc+") center center / cover no-repeat fixed";
    }

    this.shadowRoot.querySelectorAll('img').forEach((img) => {
      img.src = cardImgSrc;
      img.addEventListener('load', () => {
        img.style.display = "block";
        img.style.opacity = '0.5';
      });
    });

    cardImgLoader.src = cardImgSrc;
    openImgLoader.src = openImgSrc;

    this.needsImages = false;
  }

  _styles() {
    return __WEBPACK_IMPORTED_MODULE_0__vendor_lit_html_element_lit_element_js__["b" /* html */]`<style>
      :host {
        display: block;
      }

      .card {
        background-color: #FFF;
        border-radius: 3px;
        box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
        transition: box-shadow 225ms ease-in-out;
        height: 100%;
        overflow: hidden;
      }

      .card.bold {
        background-color: #FC4A14;
      }

      .card.openable {
        cursor: pointer;
      }

      .card.openable:hover {
        box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
      }

      .card-top {
        position: relative;
        overflow: hidden;
        border-bottom: 2px solid #F78733;
        background-color: #313131;
      }

      .card-top .card-header {
        position: absolute;
        top: 0;
        z-index: 2;
        padding: 0 1rem;
      }

      .card-top img {
        width: 100%;
        opacity: 0;
        transition: opacity 225ms ease-in-out;
      }

      .card-bottom {
        padding: 0 1rem;
      }

      .card.no-image .card-header {
        background: none;
      }

      .open-view {
        height: 0;
        overflow: scroll;
        opacity: 0;
        transition: width 225ms ease-in-out, height 225ms ease-in-out, top 225ms ease-in-out, left 225ms ease-in-out, opacity 225ms ease-in-out;
      }

      .no-image.open-view {
        background-color: #FC4A14;
      }

      .open-view .open-wrapper {
        height: 100%;
        background-color: #0008;
        padding: 1rem;
        overflow: scroll;
      }

      .open-view .open-wrapper .open-container {
        max-width: 950px;
        margin: auto;
      }

      .open-view.open {
        opacity: 1;
      }
    </style>`;
  }
}
/* unused harmony export default */


customElements.define(TnggCard.is, TnggCard.withProperties());


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

window.addEventListener('WebComponentsReady', function() {
  __webpack_require__(5);
});


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__tngg_login_js__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__tngg_account_js__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__tngg_feed_js__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__tngg_card_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__tngg_post_js__ = __webpack_require__(10);






var backgroundImage = new Image()
var openImgType = window.isMobile ? ".mobile" : ".desktop";
var backgroundImageUrl = '/images/gaming/playing1'+openImgType+'.jpg';

backgroundImage.onload = () => {
  var html = document.querySelector('html');
  var overlayColor = document.querySelector('.overlay-color');
  var container = document.querySelector('.container');
  html.style.background = 'url('+backgroundImageUrl+') no-repeat center center fixed';
  html.style.backgroundSize = 'cover';
  overlayColor.style.backgroundColor = '#4ABDACAA';
}

backgroundImage.src = backgroundImageUrl;

window.mobilecheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

window.isMobile = window.mobilecheck();

const messaging = firebase.messaging();

messaging.requestPermission()
.then(function() {
})
.catch(function(err) {
  console.log('Unable to get permission to notify.', err);
});

messaging.getToken()
.then(function(currentToken) {
  if (currentToken) {
    sendTokenToServer(currentToken);
  } else {
    console.log('No Instance ID token available. Request permission to generate one.');
  }
})
.catch(function(err) {
  console.log('An error occurred while retrieving token. ', err);
});

messaging.onTokenRefresh(function() {
  messaging.getToken()
  .then(function(refreshedToken) {
    sendTokenToServer(refreshedToken);
  })
  .catch(function(err) {
    console.log('Unable to retrieve refreshed token ', err);
  });
});

messaging.onMessage(function(payload) {
  if (!("Notification" in window)) {
    alert("This browser does not support system notifications");
  } else if (Notification.permission === "granted") {
    payload.notification.vibrate = [250, 250];
    payload.notification.requireInteraction = true;
    payload.notification.image = payload.data.image;
    payload.notification.badge = payload.data.badge;
    var notification = new Notification(payload.notification.title, payload.notification);
  }
});

function sendTokenToServer(token) {
  var unsubscribe = firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      firebase.database().ref(`/users/${user.uid}/notificationTokens/${token}`).set(true);
      unsubscribe();
    }
  });
}

window.isAdmin = function() {
  return new Promise(function(resolve, reject) {
    firebase.auth().currentUser.getIdToken()
    .then((idToken) => {
      if (JSON.parse(atob(idToken.split(".")[1])).admin) {
        resolve();
      } else {
        reject();
      }
    });
  });
}


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vendor_lit_html_element_lit_element_js__ = __webpack_require__(0);


console.log("B");

class TnggLogin extends __WEBPACK_IMPORTED_MODULE_0__vendor_lit_html_element_lit_element_js__["a" /* LitElement */] {
  static get is() {
    return "tngg-login";
  }

  constructor() {
    super();
    console.log("C");
  }

  firstInit() {
    this.firstInitCalled = true;
    var ui = new firebaseui.auth.AuthUI(firebase.auth());
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var uid = user.uid;
        var phoneNumber = user.phoneNumber;
        var providerData = user.providerData;

        firebase.database().ref('users/' + uid).update({
          uid: uid,
          displayName: displayName,
          email: email,
          profile_picture : photoURL
        });

        user.getIdToken().then((accessToken) => {
          this.shadowRoot.getElementById('login').style.opacity = "0";
          document.querySelector("tngg-account").displayName = displayName;
          if (photoURL) {
            document.querySelector("tngg-account").avatar = photoURL;
          } else {
            document.querySelector("tngg-account").avatar = '/images/user.png';
          }
          document.querySelector("tngg-account").reveal();
        });
      } else {
        ui.start('#firebaseui-auth-container', this.uiConfig());
        document.querySelector("tngg-account").hide();
        this.shadowRoot.getElementById('login').style.opacity = "1";
        this.shadowRoot.getElementById('login-opener').addEventListener("click", () => {
          this.querySelector('#firebaseui-auth-container').classList.toggle("show");
          this.shadowRoot.getElementById('login').classList.toggle("show");
          this.shadowRoot.getElementById('login-toggle').classList.toggle("show");
          this.shadowRoot.getElementById('login-message').classList.toggle("hide");
        });
      }
    }, (error) => {
      console.log(error);
    });
  }

  render() {
    return __WEBPACK_IMPORTED_MODULE_0__vendor_lit_html_element_lit_element_js__["b" /* html */]`
      ${this._styles()}
      <div id="login">
        <slot></slot>
        <div id="login-opener">
          <span id="login-message">Login</span>
          <div id="login-toggle"></div>
        </div>
      </div>
    `
  }

  _styles() {
    return __WEBPACK_IMPORTED_MODULE_0__vendor_lit_html_element_lit_element_js__["b" /* html */]`<style>
      #login {
        position: absolute;
        right: 40px;
        top: 0;
        z-index: 5;
        opacity: 0;
        transition: opacity 225ms ease-in-out;
        cursor: pointer;
        text-align: center;
        border-radius: 0 0 50px 50px;
        background-color: #4ABDAC;
        box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
      }

      #login.show {
        background-color: #0000;
        box-shadow: none;
      }

      #login-message {
        padding: 10px;
      }

      #login-message.hide {
        display: none;
      }

      #login-toggle {
        transition: transform 0.5s ease-in-out;
        margin-top: 5px;
        height: 2rem;
        line-height: 2rem;
        margin: auto;
      }

      #login-toggle:after {
        content: "▼";
      }

      #login-toggle.show {
        transform: rotate(180deg);
        border-radius: 50px;
        background-color: #4ABDAC;
        box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
        width: 2rem;
      }
    </style>`
  }

  uiConfig() {
    var clientId;
    if (window.location.hostname.indexOf("stage") >= 0) {
      clientId = "1051435527349-b6pp97dsgms9q6ckqm42s51gfdq3gk4d.apps.googleusercontent.com";
    } else {
      clientId = "838382712391-38utf875dfbieg6ovfem73ddhl98kr00.apps.googleusercontent.com";
    }

    return {
      signInSuccessUrl: '/',
      signInOptions: [
        {
          provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          authMethod: 'https://accounts.google.com',
          clientId: clientId
        },
        firebase.auth.EmailAuthProvider.PROVIDER_ID
      ],
      credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO
    };
  }

  renderCallback() {
    super.renderCallback();
    if (! this.firstInitCalled) this.firstInit();
  }
}
/* unused harmony export default */


customElements.define(TnggLogin.is, TnggLogin.withProperties());


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vendor_lit_html_element_lit_element_js__ = __webpack_require__(0);


class TnggAccount extends __WEBPACK_IMPORTED_MODULE_0__vendor_lit_html_element_lit_element_js__["a" /* LitElement */] {
  static get is() {
    return "tngg-account";
  }

  static get properties() {
    return {
      avatar: {
        type: String,
        attrName: "avatar"
      },
      displayName: {
        type: String,
        attrName: "display-name"
      }
    }
  }

  constructor() {
    super();
  }

  reveal() {
    const account = this.shadowRoot.getElementById('account');
    if (account) account.style.opacity = "1";
  }

  hide() {
    const account = this.shadowRoot.getElementById('account');
    if (account) account.style.opacity = "0";
  }

  slideToggle() {
    const signOut = this.shadowRoot.getElementById('sign-out');
    if (signOut) signOut.classList.toggle("show");
  }

  signOut() {
    firebase.auth().signOut().then(() => {
      console.log('Signed Out');
    }, (error) => {
      console.error('Sign Out Error', error);
    });
  }

  render() {
    return __WEBPACK_IMPORTED_MODULE_0__vendor_lit_html_element_lit_element_js__["b" /* html */]`
      ${this._styles()}
      <div id="account">
        <div id="display-name">${this.displayName}</div>
        <div id="sign-out" on-click=${() => this.signOut()}>Sign Out</div>
        <img id="avatar" src="${this.avatar}" on-click=${() => this.slideToggle()}>
      </div>
    `
  }

  _styles() {
    return __WEBPACK_IMPORTED_MODULE_0__vendor_lit_html_element_lit_element_js__["b" /* html */]`<style>
      #account {
        position: absolute;
        top: 0;
        border-radius: 0 0 120px 120px;
        z-index: 5;
        text-shadow: 1px 1px 1px #111d;
        opacity: 0;
        transition: opacity 225ms ease-in-out;
        text-align: center;
        min-height: 100px;
        margin: 0;
        right: 0;
        width: 80px;
        background-color: #0000;
        box-shadow: none;
      }

      #avatar {
        margin-top: 5px;
        display: block;
        border-radius: 120px 0 0 120px;
        width: 80px;
        box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
      }

      #sign-out {
        cursor: pointer;
        height: 0;
        overflow: hidden;
        transition: height 225ms ease-in-out;
      }

      #sign-out:hover {
        text-decoration: underline;
      }

      #sign-out.show {
        height: 1.25rem;
      }

      #display-name {
        display: none;
      }

      @supports (display: grid) {
        @media (min-width: 800px) {
          #account {
            right: 20px;
            width: 120px;
            background-color: #4ABDAC;
            box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
          }

          #avatar {
            border-radius: 120px;
            width: 120px;
          }

          #display-name {
            display: block;
          }
        }
      }
    </style>`
  }
}
/* unused harmony export default */


customElements.define(TnggAccount.is, TnggAccount.withProperties());


/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vendor_lit_html_element_lit_element_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__tngg_card_js__ = __webpack_require__(3);



class TnggFeed extends __WEBPACK_IMPORTED_MODULE_0__vendor_lit_html_element_lit_element_js__["a" /* LitElement */] {
  static get is() {
    return "tngg-feed";
  }

  static get properties() {
    return {
    }
  }

  constructor() {
    super();
    this.db = firebase.database();
    this.s = this.shadowRoot.querySelector;
    this.posts = [ ];
    this.idb = idb.open('newarkgaming', 1, (upgradeDB) => {
      switch (upgradeDB.oldVersion) {
        case 0:
          upgradeDB.createObjectStore('posts', {keyPath: 'uid'}).createIndex('publishDate', 'publishDate');
      }
    });

    this.idb.then(db => {
      const tx = db.transaction('posts');
      tx.objectStore('posts').index("publishDate").iterateCursor(cursor => {
        if (!cursor) return;
        this.posts.unshift(cursor.value);
        this.invalidate();
        cursor.continue();
      });
    });

    this.loadCards();
  }

  loadCards() {
    var addPost = (postSnapshot, callback) => {
      var post = postSnapshot.val();
      post.uid = postSnapshot.key;
      if (! this.posts.map(i => i.uid).includes(post.uid)) {
        this.db.ref("/users/"+post.author).once('value', (authorSnapshot) => {
          post.author = authorSnapshot.val();
          post.published = new Date(post.publishDate);
          callback(post);
          this.invalidate();
          this.idb.then(db => {
            const tx = db.transaction('posts', 'readwrite');
            tx.objectStore('posts').put(post);
            return tx.complete;
          });
        });
      }
    }

    this.db.ref("/posts").orderByChild("publishDate").once('value', (posts) => {
      posts.forEach((postSnapshot) => {
        addPost(postSnapshot, (post) => {
          this.posts.push(post);
        });
      });

      this.db.ref("/posts").on('child_added', (postSnapshot) => {
        addPost(postSnapshot, (post) => {
          this.posts.unshift(post);
        });
      });
    });
  }

  render() {
    return __WEBPACK_IMPORTED_MODULE_0__vendor_lit_html_element_lit_element_js__["b" /* html */]`
      ${this._styles()}
      <div class="container">
        ${this.posts.map((post) => __WEBPACK_IMPORTED_MODULE_0__vendor_lit_html_element_lit_element_js__["b" /* html */]`
          <tngg-card image="${post.image}" data-uid="${post.uid}">
            <h2 slot="title">${post.title}</h2>
            <p slot="message">${post.description}</p>
            <div slot="opened">
              <h2>${post.title}</h2>
              <div class="pull-right">
                <div>${post.author ? "By: " + post.author.displayName : ""}</div>
                <div>Published ${formatDate(post.published)}</div>
              </div>
              <div class="clear">
                ${post.content ? this._renderContent(post.content) : ""}
              </div>
            </div>
          </tngg-card>
        `)}
      </div>
    `
  }

  _renderContent(content) {
    return content.map((i) => {
      if (i.type === "header") {
        return __WEBPACK_IMPORTED_MODULE_0__vendor_lit_html_element_lit_element_js__["b" /* html */]`<h3>${i.text}</h3>`
      } else {
        return __WEBPACK_IMPORTED_MODULE_0__vendor_lit_html_element_lit_element_js__["b" /* html */]`<p>${i.text}</p>`
      }
    });
  }

  _styles() {
    return __WEBPACK_IMPORTED_MODULE_0__vendor_lit_html_element_lit_element_js__["b" /* html */]`<style>
      .container {
        margin: 1rem;
      }

      tngg-card {
        margin-bottom: 1rem;
        text-shadow: 1px 1px 1px #111d;
      }

      tngg-card [slot="message"] {
        color: #48464a;
        text-shadow: none;
      }

      tngg-card h1[slot="message"] {
        color: white;
      }

      tngg-card small {
        display: block;
        font-size: 1rem;
      }

      @supports (display: grid) {
        @media (min-width: 800px) {
          .container {
            display: grid;
            grid-gap: 1rem;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 1fr;
          }

          tngg-card {
            margin-bottom: 0;
          }
        }

        @media (min-width: 1000px) {
          .container {
            display: grid;
            grid-gap: 1rem;
            max-width: 950px;
            margin: 1rem auto;
            grid-template-columns: 1fr 1fr 1fr;
            grid-template-rows: 1fr;
          }

          tngg-card {
            margin-bottom: 0;
            grid-column: span 1;
          }

          tngg-post {
            width: 950px;
            display: block;
            margin: auto;
          }

          .container tngg-card:nth-of-type(4n+2) {
            grid-column: 2 / 4;
          }

          .container tngg-card:nth-of-type(4n+3) {
            grid-column: 1 / 3;
          }
        }
      }
    </style>`
  }
}
/* unused harmony export default */


function formatDate(date) {
  var monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();

  return monthNames[monthIndex] + ' ' + day + ', ' + year;
}

window.addEventListener('load', function() {

});
customElements.define(TnggFeed.is, TnggFeed.withProperties());


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vendor_lit_html_element_lit_element_js__ = __webpack_require__(0);


class TnggExit extends __WEBPACK_IMPORTED_MODULE_0__vendor_lit_html_element_lit_element_js__["a" /* LitElement */] {
  static get is() {
    return "tngg-exit";
  }

  static get properties() {
    return {
    }
  }

  constructor() {
    super();
  }

  render() {
    return __WEBPACK_IMPORTED_MODULE_0__vendor_lit_html_element_lit_element_js__["b" /* html */]`
      ${this._styles()}
      <div class="outer">
        <div class="inner">&#10005;</div>
      </div>
    `
  }

  _styles() {
    return __WEBPACK_IMPORTED_MODULE_0__vendor_lit_html_element_lit_element_js__["b" /* html */]`<style>
      .outer {
        font-size: 1.25rem;
        line-height: 1.25rem;
        width: 1.25rem;
        padding: 0.1rem;
        margin: 0.5rem;
        text-align: center;
        border-radius: 1.25rem;
        border: 3px solid;
        border-color: inherit;
        cursor: pointer;
        float: right;
        transition: box-shadow 0.5s ease-in-out;
      }

      .outer:hover {
        box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
      }

      .inner {
        transition: transform 0.5s ease-in-out;
      }

      .inner:hover {
        transform: rotate(360deg);
      }
    </style>`
  }
}
/* unused harmony export default */


customElements.define(TnggExit.is, TnggExit.withProperties());


/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vendor_lit_html_element_lit_element_js__ = __webpack_require__(0);


class TnggPost extends __WEBPACK_IMPORTED_MODULE_0__vendor_lit_html_element_lit_element_js__["a" /* LitElement */] {
  static get is() {
    return "tngg-post";
  }

  static get properties() {
    return {
      title: {
        type: String,
        attrName: "title"
      },
      description: {
        type: String,
        attrName: "description"
      },
      image: {
        type: String,
        attrName: "image"
      }
    }
  }

  constructor() {
    super();
    this.db = firebase.database();
    this.s = (selector) => { return this.shadowRoot.querySelector(selector) };
    this.sAll = (selector) => { return this.shadowRoot.querySelectorAll(selector) };
    this.content = [];

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        isAdmin().then(() => {
          this.s(".create-post").style.opacity = "1";
        });
      }
    });
  }

  titleChanged() {
    this.title = this.s("[name='title']").value;
  }

  descriptionChanged() {
    this.description = this.s("[name='description']").value;
  }

  imageChanged() {
    this.image = this.s("[name='image']").value;
  }

  openPopup() {
    this.s(".popup-container").classList.add("open");
    var viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    document.querySelector("body").style.height = viewportHeight+"px";
    document.querySelector("body").style.overflow = "hidden";
  }

  closePopup() {
    this.s(".popup-container").classList.remove("open");
    document.querySelector("body").style.height = "initial";
    document.querySelector("body").style.overflow = "initial";
  }

  render() {
    return __WEBPACK_IMPORTED_MODULE_0__vendor_lit_html_element_lit_element_js__["b" /* html */]`
      ${this._styles()}
      <button class="create-post" on-click=${(e) => this.openPopup()}>Post New Article</button>
      <div class="popup-container">
        <div class="centered">
          <tngg-exit on-click=${() => this.closePopup()}></tngg-exit>
          <input placeholder="Enter a title" name="title" on-change=${(e) => this.titleChanged()} />
          <textarea placeholder="Enter a description"
                    name="description"
                    on-change=${(e) => this.descriptionChanged()}
                    on-keydown=${(e) => this.autosize()}}></textarea>
          <div class="content">
            ${this.content.map((item) => { if (item.type === "header") { return __WEBPACK_IMPORTED_MODULE_0__vendor_lit_html_element_lit_element_js__["b" /* html */]`
                <div class="content-item header">
                  <input placeholder="Enter a Header"} />
                  <div class="remove" on-click=${(e) => this.removeItem(e.target)}>&#10005;</div>
                </div>
              `} else { return __WEBPACK_IMPORTED_MODULE_0__vendor_lit_html_element_lit_element_js__["b" /* html */]`
                <div class="content-item">
                  <textarea placeholder="Enter a paragraph"
                            on-keydown=${(e) => this.autosize()}}></textarea>
                  <div class="remove" on-click=${(e) => this.removeItem(e.target)}>&#10005;</div>
                </div>
              `}
            })}
          </div>
          <button class="add-header" on-click=${(e) => this.addHeader()}>Add Header</button>
          <button class="add-paragraph" on-click=${(e) => this.addParagraph()}>Add Paragraph</button>
          <select name="image" on-change=${(e) => this.imageChanged()}>
            <option>Choose Image</option>
            <option value="/images/gaming/playing1.jpg">Playing 1</option>
            <option value="/images/gaming/deception-cover.jpg">Deception Cover</option>
            <option value="/images/gaming/meeples4.jpg">Meeples 4</option>
            <option value="/images/gaming/stack1.jpg">Stack 1</option>
            <option value="/images/gaming/viticulture-board.jpg">Viticulture Board</option>
          </select>
          <img src="${this.image}">
          <button class="submit-post" on-click=${(e) => this.submitPost()}>Submit Article</button>
        </div>
      </div>
    `
  }

  removeItem(target) {
    target.parentNode.remove();
  }

  addHeader() {
    this.content.push({type: "header", text: "example a"});
    this.buildContent();
    this.invalidate();
  }

  addParagraph() {
    this.content.push({type: "paragraph", text: "example b"});
    this.buildContent();
    this.invalidate();
  }

  autosize() {
    setTimeout(() => {
      this.sAll('textarea').forEach((textarea) => {
        textarea.style.cssText = 'height:auto; padding:0';
        textarea.style.cssText = 'height:' + (textarea.scrollHeight + 10) + 'px';
      });
    }, 0);
  }

  buildContent() {
    var content = [];

    this.sAll(".content > .content-item").forEach((item) => {
      if (item.classList.contains("header")) {
        content.push({
          type: "header",
          text: item.querySelector("input").value
        })
      } else {
        content.push({
          type: "paragraph",
          text: item.querySelector("textarea").value
        })
      }
    });

    return content;
  }

  submitPost() {
    if (this.title && this.description && this.image) {
      this.db.ref("/posts").push().set({
        title: this.title,
        description: this.description,
        content: this.buildContent(),
        image: this.image,
        author: firebase.auth().currentUser.uid,
        publishDate: Date.now()
      });
      this.closePopup();
    } else {
      alert("Title, description and image are required fields.")
    }
  }

  _styles() {
    return __WEBPACK_IMPORTED_MODULE_0__vendor_lit_html_element_lit_element_js__["b" /* html */]`<style>
      .create-post {
        margin: 0 auto;
        display: block;
        opacity: 0;
        padding: 50px;
        font-size: 30px;
        border-style: none;
        cursor: pointer;
        color: #313131;
        background-color: #fff;
        box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
        transition: box-shadow 225ms ease-in-out;
      }

      .create-post:hover {
        box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
      }

      .popup-container {
        position: fixed;
        overflow-y: scroll;
        overflow-x: hidden;
        top: 0;
        left: 0;
        height: 0;
        width: 100%;
        transition: height 225ms ease-in-out;
        background-color: #fff;
        z-index: 6;
        box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
        border-radius: 0 0 5px 5px;
      }

      .content {
        color: #313131;
      }

      img {
        width: 100%;
        background-color: grey;
      }

      img:not([src]) {
        height: 300px;
      }

      @media (min-width: 800px) {
        img {
          height: 300px;
          width: auto;
        }

        img:not([src]) {
          width: 300px;
        }
      }

      tngg-exit {
        color: black;
      }

      .popup-container.open {
        height: 100%;
      }

      .centered {
        box-sizing: border-box;
        padding: 20px;
        width: 100%;
        margin: auto;
      }

      @media (min-width: 800px) {
        .centered {
          width: 800px;
          margin: auto;
        }
      }

      [name="title"] {
        font-size: 1.75rem;
      }

      .header input {
        font-size: 1.25rem;
      }

      textarea, input, select, button {
        display: block;
        margin: 0 0 30px 0;
        color: #313131;
      }

      input {
        color: #313131;
      }

      .popup-container button {
        padding: 10px;
        font-size: 0.75rem;
        background-color: #0000;
        border-radius: 3px;
        box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
        transition: box-shadow 225ms ease-in-out;
      }

      .popup-container button:hover {
        box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
      }

      .popup-container button:focus {
        outline: none;
      }

      select {
        font-size: 0.75rem;
        color: #555;
      }

      textarea, input:focus, select:focus {
        outline: none;
      }

      textarea, input {
        background-color: #fff;
        border: none;
        width: 100%;
        transition: border 225ms ease-in-out;
      }

      textarea {
        font-size: 1rem;
        resize: none;
        box-sizing: border-box;
        color: #555;
      }

      .popup-container .submit-post {
        background-color: #4ABDAC;
        color: #fff;
      }

      .content-item {
        position: relative;
      }

      .content-item .remove {
        position: absolute;
        top: 0;
        right: 0;
        cursor: pointer;
        transition: transform 0.5s ease-in-out;
        color: #444;
      }

      .content-item .remove:hover {
        transform: rotate(360deg);
        color: #f63;
      }
    </style>`
  }
}
/* unused harmony export default */


customElements.define(TnggPost.is, TnggPost.withProperties());


/***/ })
/******/ ]);