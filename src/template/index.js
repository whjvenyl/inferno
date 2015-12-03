import HTMLProperties from './HTMLProperties';
import ExecutionEnvironment from '../util/ExecutionEnvironment';
import setSelectValueForProperty from './setSelectValueForProperty';
import setValueForStyles from './setValueForStyles';
import removeSelectValueForProperty from './removeSelectValueForProperty';

/*
 * Template interface
 */

let template = {};

if (ExecutionEnvironment.canUseDOM) {

    template = {

        /**
         * Sets the value for a property on a node. If a value is specified as
         * '' (empty string), the corresponding style property will be unset.
         *
         * @param {DOMElement} node
         * @param {string} name
         * @param {*} value
         */
        setProperty(node, name, value) {

            let propertyInfo = HTMLProperties[name];

            if (propertyInfo) {
                if (value == null ||
                    propertyInfo.hasBooleanValue && !value ||
                    propertyInfo.hasNumericValue && isNaN(value) || // Todo! Find alternative for 'isNaN'
                    propertyInfo.hasPositiveNumericValue && value < 1) {
                    template.removeProperty(node, name);
                } else {

                    let propName = propertyInfo.propertyName;

                    if (propertyInfo.mustUseProperty) {

                        if (propertyInfo.museUseObject) {
                            if (propName === 'style') {
                                setValueForStyles(node, value)
                            }
                        } else if (propName === 'value' && (node.tagName === 'SELECT')) {
                            setSelectValueForProperty(node, value);
                        } else if ('' + node[propName] !== '' + value) {
                            node[propName] = value;
                        }
                    } else {

                        const attributeName = propertyInfo.attributeName;
                        const namespace = propertyInfo.attributeNamespace;

                        if (namespace) {
                            node.setAttributeNS(namespace, attributeName, value);
                        } else {
                            node.setAttribute(attributeName, value);
                        }
                    }
                }
                // custom attributes
            } else if (name && (name.length > 1)) {
                node.setAttribute(name, value);
            }
        },

        /**
         * Removes the value for a property on a node.
         *
         * @param {DOMElement} node
         * @param {string} name
         */
        removeProperty(node, name) {
            let propertyInfo = HTMLProperties[name];

            if (propertyInfo) {
                if (propertyInfo.mustUseProperty) {
                    let propName = propertyInfo.propertyName;
                    if (propertyInfo.hasBooleanValue) {
                        node[propName] = false;
                        // 'style' and 'dataset' property has to be removed as an attribute
                    } else if (propertyInfo.museUseObject) {
                        node.removeAttribute(propName);
                    } else if (propName === 'value' && (node.tagName === 'SELECT')) {
                        removeSelectValueForProperty(node, propName);
                    } else {
                        if ('' + node[propName] !== '') {
                            node[propName] = '';
                        }
                    }
                } else {
                    node.removeAttribute(propertyInfo.attributeName);
                }
                // Custom attributes
            } else {
                node.removeAttribute(name);
            }
        }
    }
}

export default template;