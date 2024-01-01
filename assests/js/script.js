$(document).ready(function () {
    function loadAgeImage(age, gender) {
        var imgPath = "./assests/images/";
        var overlayText = '';
        if (age < 5) {
            imgPath += "baby-image.jpg";
            overlayText = 'Baby';
        } else if (age >= 5 && age < 18) {
            imgPath += gender === "Male" ? "boy-kid-image.jpg" : "girl-kid-image.jpg";
            overlayText = 'Kid';
        } else if (age >= 18 && age < 50) {
            imgPath += gender === "Male" ? "boy-adult-image.jpg" : "girl-adult-image.jpg";
            overlayText = 'Adult';
        } else {
            imgPath += gender === "Male" ? "boy-elder-image.jpg" : "girl-elder-image.jpg";
            overlayText = 'Elder';
        }
        return {
            imgPath: imgPath,
            overlayText: overlayText
        };
    }

    $("#DateInput, #MonthInput, #YearInput").on("input", function () {
        this.value = this.value.replace(/[^\d]/g, '');
        if (this.value.length > parseInt($(this).attr("maxlength"))) {
            this.value = this.value.slice(0, parseInt($(this).attr("maxlength")));
        }
    });

    $("#DateInput, #MonthInput, #YearInput, #GenderInput").on("focus", function () {
        $(this).removeClass('border border-danger invalid-shadow');
    });

    $("#calculateAgeBtn").click(function () {
        // Get the input values
        var year = $("#YearInput").val().trim();
        var month = parseInt($("#MonthInput").val()) - 1;
        var day = parseInt($("#DateInput").val());
        var gender = $("#GenderInput").val();

        // Validate input
        if (isNaN(day) || isNaN(month) || isNaN(parseInt(year)) || year.length !== 4 || gender === "") {
            // Display error using SweetAlert
            Swal.fire({
                icon: 'error',
                title: 'Invalid Input',
                text: 'Please enter a valid year (4 digits), month, and day.',
            });
            $('#DateInput, #MonthInput, #YearInput, #GenderInput').removeClass('border border-danger invalid-shadow');
            if (isNaN(day)) {
                $('#DateInput').addClass('border border-danger invalid-shadow');
            }
            if (isNaN(month)) {
                $('#MonthInput').addClass('border border-danger invalid-shadow');
            }
            if (isNaN(parseInt(year)) || year.length !== 4) {
                $('#YearInput').addClass('border border-danger invalid-shadow');
            }
            if (gender === "") {
                $("#GenderInput").addClass('border border-danger invalid-shadow');
            }
            return;
        } else {
            $('#DateInput, #MonthInput, #YearInput, #GenderInput').removeClass('border border-danger invalid-shadow');
        }

        // Check if month is within valid range (1-12)
        if (month < 0 || month > 11) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Month',
                text: 'Month should be between 1 and 12.',
            });
            $('#MonthInput').addClass('border border-danger invalid-shadow');
            return;
        } else {
            $('#MonthInput').removeClass('border border-danger invalid-shadow');
        }

        // Check if day is valid for the selected month
        var maxDaysInMonth = new Date(year, month + 1, 0).getDate();
        if (day < 1 || day > maxDaysInMonth) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Day',
                text: 'Day should be between 1 and ' + maxDaysInMonth + ' for the selected month.',
            });
            $('#DateInput').addClass('border border-danger invalid-shadow');
            return;
        } else {
            $('#DateInput').removeClass('border border-danger invalid-shadow');
        }

        // Check if the input date is in the future
        var inputDate = new Date(year, month, day);
        if (inputDate > new Date()) {
            // Display error using SweetAlert
            Swal.fire({
                icon: 'error',
                title: 'Invalid Date',
                text: 'Please enter a date in the past.',
            });
            $('#DateInput, #MonthInput, #YearInput').addClass('border border-danger invalid-shadow');
            return;
        } else {
            $('#DateInput, #MonthInput, #YearInput').removeClass('border border-danger invalid-shadow');
        }

        // Calculate the age
        var today = new Date();
        var age = today.getFullYear() - inputDate.getFullYear();
        var monthDiff = today.getMonth() - inputDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < inputDate.getDate())) {
            age--;
        }

        // Display the result
        $('#ResultDisplay').text(age);
        $('.result-container').removeClass('d-none');
        // Load the image based on age and gender
        var result = loadAgeImage(age, gender);
        $('#resultImage').attr('src', result.imgPath);
        $('.overlay-text h4').text(result.overlayText);
    });
});
$(document).ready(function () {
    // Function to apply styles based on theme START ---------->
    function applyThemeStyles(preferredDarkMode) {
        var themeText = $('.navbar-theme-text');
        var themeIcon = $('.navbar-theme-icon');
        if (preferredDarkMode) {
            // Dark Mode
            themeText.text('Dark Theme');
            themeIcon.removeClass('fa-lightbulb fa-sun').addClass('fa-moon');
            $('body').removeClass('text-dark bg-light').addClass('bg-dark text-white');
            $('.card').addClass('bg-dark text-light').removeClass('bg-light text-dark');

        } else {
            // Light Mode   
            themeText.text('Light Theme');
            themeIcon.removeClass('fa-moon').addClass('fa-lightbulb fa-sun');
            $('body').removeClass('bg-dark text-white').addClass('text-dark bg-light');
            $('.card').removeClass('bg-dark text-light').addClass('bg-light text-dark');
        }
    }

    function getUserSystemTheme() {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    applyThemeStyles(getUserSystemTheme());

    $('.toggle-light').click(function () {
        applyThemeStyles(false);
        saveThemePreference('light');
    });

    $('.toggle-dark').click(function () {
        applyThemeStyles(true);
        saveThemePreference('dark');
    });

    $('.toggle-default').click(function () {
        const systemTheme = getUserSystemTheme();
        applyThemeStyles(systemTheme);
        saveThemePreference(systemTheme ? 'dark' : 'light');
    });

    function saveThemePreference(theme) {
        localStorage.setItem('themePreference', theme);
    }

    const savedTheme = localStorage.getItem('themePreference') || 'default';

    if (savedTheme === 'light') {
        $('.toggle-light').click();
    } else if (savedTheme === 'dark') {
        $('.toggle-dark').click();
    } else {
        $('.toggle-default').click();
    }
    // Function to apply styles based on theme END ---------->
});