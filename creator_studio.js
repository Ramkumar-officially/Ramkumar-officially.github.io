
const videoForm = document.getElementById("videoForm");
const videoTable = document.getElementById("videoTable");

let videos = JSON.parse(localStorage.getItem("creatorVideos")) || [];

function saveVideos() {
    localStorage.setItem("creatorVideos", JSON.stringify(videos));
}

function renderVideos() {
    videoTable.innerHTML = "";

    if (videos.length === 0) {
        videoTable.innerHTML = `
            <tr class="empty-row">
                <td colspan="6">No videos added yet. Add your first video above.</td>
            </tr>`;
    }

    videos.forEach((video, index) => {
        const row = document.createElement("tr");

        [video.title, Number(video.views).toLocaleString(),
         video.ctr + "%", video.duration, video.watchTime + "h"]
        .forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        const actionCell = document.createElement("td");
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-button";
        deleteButton.addEventListener("click", () => {
            videos.splice(index, 1);
            saveVideos();
            renderVideos();
        });

        actionCell.appendChild(deleteButton);
        row.appendChild(actionCell);
        videoTable.appendChild(row);
    });

    const totalViews = videos.reduce((sum, video) => sum + Number(video.views), 0);
    const totalWatchTime = videos.reduce((sum, video) => sum + Number(video.watchTime), 0);
    const averageCTR = videos.length
        ? videos.reduce((sum, video) => sum + Number(video.ctr), 0) / videos.length
        : 0;

    document.getElementById("totalViews").textContent = totalViews.toLocaleString();
    document.getElementById("totalVideos").textContent = videos.length;
    document.getElementById("averageCTR").textContent = averageCTR.toFixed(1) + "%";
    document.getElementById("totalWatchTime").textContent = totalWatchTime.toFixed(1) + "h";
    document.getElementById("videoCount").textContent = videos.length + " videos";
}

videoForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const video = {
        title: document.getElementById("videoTitle").value.trim(),
        views: Number(document.getElementById("videoViews").value),
        ctr: Number(document.getElementById("videoCTR").value),
        duration: document.getElementById("videoDuration").value.trim(),
        watchTime: Number(document.getElementById("videoWatchTime").value)
    };

    if (!video.title || !video.duration ||
        video.ctr < 0 || video.ctr > 100) {
        alert("Please enter valid video details.");
        return;
    }

    videos.push(video);
    saveVideos();
    renderVideos();
    videoForm.reset();
});

renderVideos();
