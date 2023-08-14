<template>
  <div class="container">
        <div class="content-wrapper">
            <div class="overlay" v-if="isLoading"><div class="loader"></div></div>
            <h2 class="headingText">Download Reels from Instagram</h2>
            <input type="text" class="input" ref="input" placeholder="Insert Reels link"/>
            <button class="confirmBtn" type="submit" @click.prevent="downloadMedia">Download Reels</button>
            <div class="alert" ref="alert" v-show="isAlert"></div>
        </div>
    </div>
</template>

<script>

import axios from "axios"
import { saveAs } from 'file-saver';
export default {
  name: 'App',
  data(){
    return {
        isLoading: false,
        isAlert: false
    }
  },
  methods: {
    async downloadMedia(){
        const inputUrl = (this.$refs.input.value).trim()
        this.$refs.input.value = ""
        if(inputUrl.length > 5){
            this.isLoading = true
            const id = new URL(inputUrl).pathname.split('/').filter(val => !!val).at(-1)
            console.log(id)
            const url = "http://localhost:3001/api/" + id
            try {
                const response = await axios.get(url)
                if(!response.data.success){
                    throw new Error(response.data.error)
                } else {
                    const reelsLink = response.data.url
                    await this.getMedia(reelsLink, id)
                }
            } catch (error) {
                this.setAlert("error", error.message)
                this.isLoading = false
            }
        }
    },
    async getMedia(videoUrl, id){
        try {
            const response = await axios.get(videoUrl, { responseType: 'blob' });
            const blob = response.data;
            saveAs(blob, id);
            this.setAlert("success", "Reels successfully downloaded")
        } catch (error) {
            this.setAlert("error", error.message)
            this.isLoading = false
        }
        this.isLoading = false
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
