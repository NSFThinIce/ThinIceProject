const buttons = document.querySelectorAll(".text-link", ".image-link")

buttons.forEach((button) => {
    button.addEventListener("click", () => {
        switch (button.id) {
            case "home-page":
                fetch("/pages/home/index.html")
                    .then((response) => {
                        return response.text()
                    })
                    .then((html) => {
                        document.getElementById("content").innerHTML = html
                        console.log(html)
                    })
                    .catch((err) => {
                        console.log(err)
                    })
                break;
        
            default:
                console.log(button.id)
                break;
        }
    })
})