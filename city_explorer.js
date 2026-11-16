
const filterButtons = document.querySelectorAll(".filter-btn");
const placeCards = document.querySelectorAll(".place-card");
const searchInput = document.getElementById("placeSearch");
const emptyMessage = document.getElementById("emptyMessage");

let selectedCategory = "all";

function filterPlaces() {
    const searchText = searchInput.value.toLowerCase();
    let visibleCount = 0;

    placeCards.forEach(card => {
        const category = card.dataset.category;
        const name = card.dataset.name;

        const matchesCategory =
            selectedCategory === "all" || category === selectedCategory;

        const matchesSearch = name.includes(searchText);

        if (matchesCategory && matchesSearch) {
            card.style.display = "block";
            visibleCount++;
        } else {
            card.style.display = "none";
        }
    });

    emptyMessage.style.display = visibleCount === 0 ? "block" : "none";
}

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        filterButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        selectedCategory = button.dataset.filter;
        filterPlaces();
    });
});

searchInput.addEventListener("input", filterPlaces);
