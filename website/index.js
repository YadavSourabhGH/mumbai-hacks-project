document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("chatbot-modal");
    const openChatbot = document.getElementById("open-chatbot");
    const closeBtn = document.querySelector(".close");

    // Open modal
    openChatbot.addEventListener("click", () => {
        modal.style.display = "block";
    });

    // Close modal
    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    // Close modal when clicking outside of it
    window.addEventListener("click", (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });
});
