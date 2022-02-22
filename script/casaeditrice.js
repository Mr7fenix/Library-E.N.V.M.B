const Vue = require('vue');
const fs = require('fs');
const ut = require('./script/function.js');
let path = require('path')

Vue.createApp({
    data(){
        return {
            editori: [],
            addFlag: false,
            deleteFlag: false,
            newEditor: ''
        }
    },
    created() {
        this.editori = ut.editorList();
        console.log(ut.editorList)
    },
    methods : {
        addPopup(){
            if (!this.deleteFlag) this.addFlag = true;
        },
        deletePopup(){
            if (!this.addFlag) this.deleteFlag = true;
        },
        closePopup(){
            this.deleteFlag = false;
            this.addFlag = false;
        },
        add(){
            editori.push(newEditor)
            fs.writeFileSync()
        }
    }
}).mount("#app")