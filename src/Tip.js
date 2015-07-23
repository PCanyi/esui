/**
 * ESUI (Enterprise Simple UI)
 * Copyright 2013 Baidu Inc. All rights reserved.
 *
 * @ignore
 * @file 提示信息控件
 * @author lisijin, dbear, otakustay
 */
define(
    function (require) {
        var eoo = require('eoo');
        var esui = require('./main');
        var u = require('underscore');
        var Control = require('./Control');
        var $ = require('jquery');

        require('./TipLayer');

        /**
         * 提示信息控件
         *
         * `Tip`控件是一个小图标，当鼠标移到图标上时，会出现一个层显示提示信息
         *
         * @extends Control
         * @requires TipLayer
         * @constructor
         */
        var Tip = eoo.create(
            Control,
            {

                /**
                 * 控件类型，始终为`"Tip"`
                 *
                 * @type {string}
                 * @readonly
                 * @override
                 */
                type: 'Tip',

                /**
                 * 初始化参数
                 *
                 * @param {Object} [options] 构造函数传入的参数
                 * @protected
                 * @override
                 */
                initOptions: function (options) {
                    // 默认选项配置
                    var properties = {
                        title: '',
                        content: '',
                        /**
                         * @property {boolean} arrow
                         *
                         * 是否需要箭头
                         *
                         * 为了方便从DOM生成，此属性在初始化时如果为字符串`"false"`，
                         * 将被认为是布尔值`false`处理
                         *
                         * 具体参考{@link TipLayer#arrow}属性
                         */
                        arrow: true,

                        /**
                         * @property {string} showMode
                         *
                         * 指定信息浮层的显示方案，
                         * 具体参考{@link TipLayer#attachTo}方法的`showMode`参数的说明
                         */
                        showMode: 'over',

                        /**
                         * @property {number} delayTime
                         *
                         * 指定信息浮层的显示的延迟时间，以毫秒为单位，
                         * 具体参考{@link TipLayer#attachTo}方法的`delayTime`参数的说明
                         */
                        delayTime: 500,

                        /**
                         * @property {string} icon
                         *
                         * 用于输出内部icon
                         */
                        icon: 'question-circle',

                        /**
                         * @property {string} appendToElement
                         *
                         * 把目标tip加在哪个元素上
                         */
                        appendToElement: null,

                        /**
                         * @property {Object} selfLeft
                         *
                         * 定位属性
                         */
                        selfRight: 'right',
                        
                        /**
                         * @property {Object} selfTop
                         *
                         * 定位属性
                         */
                        selfTop: 'top',

                        /**
                         * @property {Object} targetLeft
                         *
                         * Tip定位属性
                         */
                        tipRight: 'left',

                        /**
                         * @property {Object} targetLeft
                         *
                         * Tip定位属性
                         */
                        tipTop: 'top'
                    };

                    u.extend(properties, options);
                    extractDOMProperties(this, properties);
                    this.setProperties(properties);
                },

                /**
                 * 初始化DOM结构
                 *
                 * @protected
                 * @override
                 */
                initStructure: function () {
                    var main = document.createElement('div');
                    document.body.appendChild(main);

                    var tipLayer = esui.create(
                        'TipLayer',
                        {
                            main: main,
                            childName: 'layer',
                            content: this.content,
                            title: this.title,
                            arrow: this.arrow,
                            /**
                             * @property {number} [layerWidth=200]
                             *
                             * 指定信息浮层的宽度，具体参考{@link TipLayer#width}属性
                             */
                            width: this.layerWidth || 200,
                            viewContext: this.viewContext,
                            // 添加一个类以方便区别inline tiplayer和全局tiplayer
                            variants: 'from-tip',
                            appendToElement: this.appendToElement
                        }
                    );
                    this.addChild(tipLayer);
                    tipLayer.render();

                    var attachOptions = {
                        // 原来老的代码写的是this.mode
                        // 其实暴露的是showMode: 'over',
                        // 这样向后兼容一下
                        showMode: this.mode || this.showMode,
                        delayTime: this.delayTime,
                        targetControl: this.id,
                        positionOpt: {
                            right: this.tipRight,
                            top: this.tipTop
                        },
                        targetPositionOpt: {
                            right: this.selfRight,
                            top: this.selfTop
                        }
                    };
                    tipLayer.attachTo(attachOptions);
                },

                /**
                 * 重渲染
                 *
                 * @method
                 * @protected
                 * @override
                 */
                repaint: require('./painters').createRepaint(
                    Control.prototype.repaint,
                    {
                        name: 'title',
                        paint: function (tip, value) {
                            var layer = tip.getChild('layer');
                            if (layer) {
                                layer.setTitle(value);
                            }
                        }
                    },
                    {
                        name: 'content',
                        paint: function (tip, value) {
                            var layer = tip.getChild('layer');
                            if (layer) {
                                layer.setContent(value);
                            }
                        }
                    }
                )
            }
        );

        /**
         * 从DOM中抽取`title`和`content`属性，如果有的话优先级低于外部给定的
         *
         * @param {HTMLElement} tip 主元素
         * @param  {Object} options 构造函数传入的参数
         * @ignore
         */
        function extractDOMProperties(tip, options) {
            var html = '';
            var main = tip.main;
            options.title = options.title || main.getAttribute('title');
            main.removeAttribute('title');
            options.content = options.content || main.innerHTML;
            if (options.icon) {
                html = '<span class="'
                    + tip.helper.getIconClass(options.icon)
                    + '"></span>';
            }
            main.innerHTML = html;
        }

        esui.register(Tip);
        return Tip;
    }
);
