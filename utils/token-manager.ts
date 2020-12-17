export default {
    token: '',
    setToken: function (token: string) {
        this.token = token
    },
    getToken: function () {
        return this.token
    },
    attachToken: function(url: string){
        return `${url}?token=${this.token}`
    }
}