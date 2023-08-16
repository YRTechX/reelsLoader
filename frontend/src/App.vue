<template>
  <div class="container">
        <div class="content-wrapper">
            <div class="overlay" v-if="isLoading"><div class="loader"></div></div>
            <h2 class="headingText">Download Reels from Instagram</h2>
            <div class="dropArea" @dragover.prevent="onDragOver" @dragleave.prevent="onDragLeave" @drop.prevent = "onDrop">
                <p v-if="!isDragging" class="dropAreaText">Drag and drop file here or <span @click="selectFile">Choose</span></p>
                <p v-else class="dropAreaText">Drop the file here</p>

            </div>
            <input type="file" class="input" ref="input" accept= ".txt" @change="onFileSelect"/>
            <template v-if="selectedFile">
            <p>Selected file:</p>
            <p class="selectedFile">{{selectedFile.name}}<span class="deleteIcon" @click="deleteFile">✕</span></p>
            </template>
            <p>Enter path for saving reels (default path is ../downloads)</p>
            <input class="input" id="show" ref="saveDestination" placeholder="e.g. /downloads/reels" type="text" v-model.trim="pathToSave"/>
            <button class="confirmBtn" type="submit" @click.prevent="downloadMedia">Download Reels</button>
            <div class="alert" ref="alert" v-show="isAlert"></div>
        </div>
    </div>
</template>

<script>

import axios from "axios"
export default {
    name: 'App',
    data(){
        return {
            isLoading: false,
            isAlert: false,
            isDragging: false,
            selectedFile: null,
            pathToSave: null
        }
    },
    methods: {
        async downloadMedia(){
            if(this.selectedFile){
                this.isLoading = true
                const fileContent = await this.readFile(this.selectedFile)
                if(fileContent){
                    const linksArray = fileContent.split('\n').filter(val => !!val)
                    for(const link of linksArray){
                        const id = new URL(link).pathname.split('/').filter(val => !!val).at(-1)
                        let url = "http://localhost:3001/api/" + id
                        if(this.pathToSave){
                            url+="?pathToSave="+this.pathToSave
                        }
                        try {
                            const response = await axios.get(url)
                            if(!response.data.success){
                                throw new Error(response.data.error)
                            } else {
                                this.setAlert('success', response.data.msg)
                            }
                        } catch (error) {
                            this.setAlert("error", error.message)
                        }
                    }
                }
            }
            this.isLoading = false
        },
        async readFile(file){
            return new Promise((resolve, reject) => {
                const reader = new FileReader();

                reader.onload = (event) => {
                const contents = event.target.result;
                resolve(contents);
                };

                reader.onerror = (event) => {
                reject(new Error('Error reading the file'));
                };

                reader.readAsText(file);
            });
        },
        setAlert(type, msg){
            this.isAlert = true
            if(type == "success"){
                this.$refs.alert.style.cssText="background-color: #E9F5EA; color: #8EAF50;"
                this.$refs.alert.innerHTML = msg
            } else {
                this.$refs.alert.style.cssText="background-color: #FDE8E6; color: #F34335;"
                this.$refs.alert.innerHTML = "Error: " + msg
            }
            setTimeout(()=> {
                this.isAlert = false
            },3000)
        },
        selectFile(){
            this.$refs.input.click()
        },
        onFileSelect(event){
            console.log(event.target.files)
            const files = event.target.files
            if(files.length){
                if(files[0].type.split('/')[0] == 'text'){
                    this.selectedFile = files[0]
                } else {
                    this.setAlert("error", "choosed unsupported file type")
                }
            }
            
        },
        deleteFile(){
            this.selectedFile = null
            this.$refs.input.value = ""
        },
        onDragOver(event){
            event.preventDefault()
            this.isDragging = true
            event.dataTransfer.dropEffect = "copy"
        },
        onDragLeave(event){
            event.preventDefault()
            this.isDragging = false
        },
        onDrop(event){
            event.preventDefault()
            this.isDragging = false
            const files = event.dataTransfer.files
            if(files.length && files.length == 1){
                if(files[0].type.split('/')[0] == 'text'){
                    this.selectedFile = files[0]
                } else {
                    this.setAlert("error", "choosed unsupported file type")
                }
            } else {
                this.setAlert("error", "only one file at a time")
            }
        }
    
    }
}
</script>

<style>

* {
	padding: 0px;
	margin: 0px;
	border: none;
}
body{
    min-height: 100vh;
    background-color: #EDEFF2;
}
*,
*::before,
*::after {
	box-sizing: border-box;
}
#show{
    display: block;
}
.deleteIcon{
    margin-left: 10px;
    padding: 3px;
    transition: 0.2s ease-in-out;
}
.deleteIcon:hover{
    background-color: #ebebeb78;
    cursor: pointer;
    font-weight: bold;
}
.dropArea{
    margin-bottom: 16px;
    background-color: #ebebeb78;
    display: flex;
    justify-content: center;
    align-items: center;
    color: gray;
    min-height: 200px;
}
.dropArea span{
    color: black;
    font-weight: bold;
}
.dropArea span:hover {
    cursor: pointer;
}
.selectedFile{
    margin-bottom: 16px;
}
.container {
    max-width: 1280px;
    padding: 0 16px;
    margin: 0 auto;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}
.content-wrapper{
    padding: 16px;
    border-radius: 5px;
    background-color: #FFFFFF;
    display: flex;
    flex-direction: column;
    position: relative;
}
.headingText {
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    font-size: 32px;
    margin-bottom: 16px;
}
.input {
    border: none;
    padding: 16px;
    border-radius: 5px;
    border: 1px solid rgba(128,128,128,.418);
    margin-bottom: 16px;
    display: none;
}
.confirmBtn {
    padding: 8px 16px;
    box-shadow: 0 1px 3px gray;
    background-color: #FFFFFF;
    cursor: pointer;
    margin-bottom: 16px;
}
.confirmBtn:hover{
    background-color: #F6F6F6;
    transition: 0.2s ease-in-out;
    box-shadow: 0 1px 4px gray;
}
.confirmBtn:active{
    transform: translateY(3%);
    transition: 0;
}
.overlay{
  background-color: #ffffff5b;
  width: 100%;
  height: 100%;
  position: absolute;
  z-index:100;
  left: 0;
  top: 0;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.loader {
  border: 2px solid #f3f3f3;
  border-radius: 50%;
  border-top: 3px solid rgb(73, 73, 73);
  width: 30px;
  height: 30px;
  -webkit-animation: spin 2s linear infinite; /* Safari */
  animation: spin 2s linear infinite;
}

/* Safari */
@-webkit-keyframes spin {
  0% { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.alert{
    padding: 16px;
}
.alertStyle{

}

</style>
