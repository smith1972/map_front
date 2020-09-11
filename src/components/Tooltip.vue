<template>
    <div id="tooltip" v-bind:style="styleObj">
        <div class="wrap">
            <div class="view">
                <div class="title">
                    {{ vals.title }}
                </div>
                <div class="text" v-html="vals.message"></div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Tooltip',
        props: {
            vals: {
                type: Object,
                default: function(){
                    return {
                        top: 0,
                        left: 0,
                        title: '',
                        message: ''
                    }
                }
            }
        },
        computed: {
            styleObj: function () {
                return {
                    top: this.vals.top + 'px',
                    left: this.vals.left + 'px'
                }
            }
        },
        data: function () {
            return {
            }
        },
        methods: {
            highwaySelect: function (e) {
                this.$emit('filterOut', {
                    highway: e.target.value
                })
            }
        },
    }
</script>

<style scoped>
    #tooltip {
        position: absolute;
        height: 1px;
        width: 1px;
        z-index: 99999;
    }

    #tooltip .wrap{
        position: relative;
        display: inline-block;
    }

    #tooltip .view {
        /*visibility: hidden;*/
        width: 200px;
        background-color: #555;
        color: #ffffff;
        text-align: center;
        border-radius: 6px;
        padding: 5px 0;
        position: absolute;
        z-index: 99999;
        bottom: 125%;
        left: 50%;
        margin-left: -60px;
        opacity: 0.7;
        transition: opacity 0.3s;
    }

    #tooltip .view::after {
        content: "";
        position: absolute;
        top: 100%;
        left: 50%;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: #555 transparent transparent transparent;
    }

    #tooltip .view .title{
        font-weight: bold;
    }

    #tooltip .view .text{
        padding: 3px;
        font-size: 20px;
    }


</style>