

let defaultHabits = [
    { id: 1, name: "Drink water", emoji: "💧", completedDates: [] },
    { id: 2, name: "Reading Books", emoji: "📚", completedDates: [] },
    { id: 3, name: "Exercise", emoji: "🏃", completedDates: [] },
    { id: 4, name: "Meditation", emoji: "🧘", completedDates: [] },
    { id: 5, name: "Learn Coding", emoji: "🌱", completedDates: [] }
];




let habits = defaultHabits;

try {

    let storedHabits = localStorage.getItem("habits");

    if (storedHabits !== null) {

        let parsedHabits = JSON.parse(storedHabits);

        if (Array.isArray(parsedHabits)) {
            habits = parsedHabits;
        }

    }

} catch (error) {

    console.log("Unable to load habits:", error);

}



let habitCard = document.getElementById("habitCard");

let myBtn = document.getElementById("myBtn");

let newHabitInput = document.getElementById("newHabit");

let doneCount = document.getElementById("doneCount");




let today = new Date().toLocaleDateString("en-CA");

document.getElementById("currentDate").textContent =
    new Date().toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long"
    });




function saveHabits() {

    try {

        localStorage.setItem("habits", JSON.stringify(habits));

    } catch (error) {

        console.log("Unable to save habits:", error);

        alert("Unable to save your habits!");

    }

}




function renderHabits() {

    habitCard.innerHTML = "";

    

    if (habits.length === 0) {

        habitCard.innerHTML = `
            <div class="empty-state">
                <h3>🌱 No habits yet!</h3>
                <p>Add your first habit and start your journey.</p>
            </div>
        `;

    }

    

    habits.forEach(function(ele) {

        let isCompleted = ele.completedDates.includes(today);

        habitCard.innerHTML += `

            <div class="card ${isCompleted ? "completed" : ""}">

                <div class="ca">

                    <span>${ele.emoji}</span>

                    <h3>${ele.name}</h3>

                </div>

                <div class="myBtn">

                    <button
                        data-complete-id="${ele.id}"
                        class="${isCompleted ? "undo-btn" : "complete-btn"}">

                        ${isCompleted ? "Undo" : "Complete"}

                    </button>

                    <button data-id="${ele.id}">
                        Delete
                    </button>

                </div>

            </div>

        `;

    });


    

    let completedCount = habits.filter(function(habit) {

        return habit.completedDates.includes(today);

    }).length;


    doneCount.textContent = `${completedCount}/${habits.length}`;

}




renderHabits();




let emojibtn = document.querySelectorAll(".emoji-btn");

let selectedEmoji = "🌱";

emojibtn.forEach(function(e) {

    e.addEventListener("click", function() {

        emojibtn.forEach(function(i) {

            i.classList.remove("selected");

        });

        e.classList.add("selected");

        selectedEmoji = e.getAttribute("data-emoji");

    });

});




function addHabit() {

    let newHabit = newHabitInput.value.trim();


    if (newHabit === "") {

        alert("Enter new habit name");

    }

    else if (habits.some(function(ele) {

        return ele.name.toLowerCase() === newHabit.toLowerCase();

    })) {

        alert("Already present in the list");

    }

    else {

        let newObj = {

            id: Date.now(),

            name: newHabit,

            emoji: selectedEmoji,

            completedDates: []

        };


        habits.push(newObj);

        saveHabits();

        renderHabits();

        newHabitInput.value = "";

    }

}




myBtn.addEventListener("click", function() {

    addHabit();

});




newHabitInput.addEventListener("keydown", function(e) {

    if (e.key === "Enter") {

        addHabit();

    }

});




habitCard.addEventListener("click", function(e) {


    

    let completeBtn = e.target.closest("[data-complete-id]");

    if (completeBtn) {

        let id = Number(completeBtn.getAttribute("data-complete-id"));


        let selectedHabit = habits.find(function(hab) {

            return hab.id === id;

        });


        if (selectedHabit.completedDates.includes(today)) {

            selectedHabit.completedDates =
                selectedHabit.completedDates.filter(function(date) {

                    return date !== today;

                });

        }

        else {

            selectedHabit.completedDates.push(today);

        }


        saveHabits();

        renderHabits();

    }


    

    let deleteBtn = e.target.closest("[data-id]");

    if (deleteBtn) {

        let id = Number(deleteBtn.getAttribute("data-id"));


        let confirmDelete = confirm(
            "Are you sure you want to delete this habit?"
        );


        if (confirmDelete) {

            habits = habits.filter(function(habit) {

                return habit.id !== id;

            });


            saveHabits();

            renderHabits();

        }

    }

});




async function loadDailyQuote() {

    let quoteText = document.getElementById("quoteText");

    let quoteAuthor = document.getElementById("quoteAuthor");


    quoteText.textContent = "Loading...";

    quoteAuthor.textContent = "";


    let fallbackQuotes = [

        {
            quote: "Success is the sum of small efforts repeated day in and day out.",
            author: "Robert Collier"
        },

        {
            quote: "Small steps every day lead to big results.",
            author: "Unknown"
        },

        {
            quote: "Great things are done by a series of small things brought together.",
            author: "Vincent van Gogh"
        }

    ];


    try {

        let response = await fetch(
            "https://dummyjson.com/quotes/random"
        );


        if (!response.ok) {

            throw new Error("Failed to fetch quote");

        }


        let data = await response.json();


        quoteText.textContent = data.quote;

        quoteAuthor.textContent = "- " + data.author;

    }

    catch (error) {

        console.log("Quote API error:", error);


        let randomQuote = fallbackQuotes[
            Math.floor(Math.random() * fallbackQuotes.length)
        ];


        quoteText.textContent = randomQuote.quote;

        quoteAuthor.textContent = "- " + randomQuote.author;

    }

}




loadDailyQuote();