export const DAYS = ["Man", "Tirs", "Ons", "Tors", "Fre", "Lør", "Søn"];

export const MOCKAPPS = [
    {
        date: new Date(2024, 4, 1),
        title: "Morning Shift",
        startTime: "08:00",
        endTime: "12:00",
        status: "covered",
        color: "#4CAF50"  // Green for covered
    },
    {
        date: new Date(2024, 4, 1),
        title: "Afternoon Shift",
        startTime: "12:00",
        endTime: "16:00",
        status: "pending",
        color: "#FFEB3B"  // Yellow for pending
    },
    {
        date: new Date(2024, 4, 1),
        title: "Night Shift",
        startTime: "16:00",
        endTime: "20:00",
        status: "for_sale",
        color: "#F44336"  // Red for for sale
    },
];