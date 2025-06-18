document.addEventListener('DOMContentLoaded', function() {
    lucide.createIcons();

    const elements = {
        authPage: document.getElementById('auth-page'),
        mainPortal: document.getElementById('main-portal'),
        loginForm: document.getElementById('login-form'),
        sendOtpBtn: document.getElementById('send-otp-btn'),
        phoneInputGroup: document.getElementById('phone-input-group'),
        otpInputGroup: document.getElementById('otp-input-group'),
        authError: document.getElementById('auth-error'),
        logoutButton: document.getElementById('logout-button'),
        mobileLogoutButton: document.getElementById('mobile-logout-button'),
        pages: document.querySelectorAll('.page'),
        navLinks: document.querySelectorAll('.nav-link'),
        mobileMenuButton: document.getElementById('mobile-menu-button'),
        mobileMenu: document.getElementById('mobile-menu'),
        supportForm: document.getElementById('support-form'),
        demoForm: document.getElementById('demo-form'),
        confirmationModal: document.getElementById('confirmation-modal'),
        closeModalButton: document.getElementById('close-modal'),
        confirmationTitle: document.getElementById('confirmation-title'),
        confirmationMessage: document.getElementById('confirmation-message'),
        ticketNumberSpan: document.getElementById('ticket-number'),
        calendarModal: document.getElementById('calendar-modal'),
        openCalendarBtn: document.getElementById('open-calendar-btn'),
        openDemoCalendarBtn: document.getElementById('open-demo-calendar-btn'),
        monthYearHeader: document.getElementById('month-year-header'),
        calendarGrid: document.getElementById('calendar-grid'),
        prevMonthBtn: document.getElementById('prev-month-btn'),
        nextMonthBtn: document.getElementById('next-month-btn'),
        calendarView: document.getElementById('calendar-view'),
        timeSlotsView: document.getElementById('time-slots-view'),
        backToCalendarBtn: document.getElementById('back-to-calendar-btn'),
        timeSlotHeader: document.getElementById('time-slot-header'),
        timeSlotsGrid: document.getElementById('time-slots-grid'),
        preferredTimeDisplay: document.getElementById('preferred-time-display'),
        demoTimeDisplay: document.getElementById('demo-time-display'),
        kbMainView: document.getElementById('kb-main-view'),
        kbNavButtons: document.querySelectorAll('.kb-nav-btn'),
        kbSubpages: document.querySelectorAll('.kb-subpage'),
        kbBackButtons: document.querySelectorAll('.kb-back-btn'),
        trainingKbMainView: document.getElementById('training-kb-main-view'),
        trainingKbNavButtons: document.querySelectorAll('.training-kb-nav-btn'),
        trainingKbSubpages: document.querySelectorAll('.training-kb-subpage'),
        trainingKbBackButtons: document.querySelectorAll('.training-kb-back-btn')
    };

    let currentDate = new Date();
    let selectedDate;
    let currentCalendarTarget;

    const showPage = (pageId) => {
        elements.pages.forEach(p => p.classList.remove('active'));
        const pageToShow = document.getElementById(pageId);
        if (pageToShow) pageToShow.classList.add('active');
        if (pageId === 'knowledge-base-page') showKbMainView();
        if (pageId === 'training-distributors-page') showTrainingKbMainView();
        window.scrollTo(0, 0);
    };

    const showPortal = () => {
        if(elements.authPage && elements.mainPortal) {
            elements.authPage.classList.add('hidden');
            elements.mainPortal.classList.remove('hidden');
        }
    };

    const showAuthPage = () => {
        if(elements.mainPortal && elements.authPage && elements.loginForm) {
            elements.mainPortal.classList.add('hidden');
            elements.authPage.classList.remove('hidden');
            if(elements.phoneInputGroup) elements.phoneInputGroup.classList.remove('hidden');
            if(elements.otpInputGroup) elements.otpInputGroup.classList.add('hidden');
            elements.loginForm.reset();
            showPage('home-page');
        }
    };

    const logout = () => {
        sessionStorage.clear();
        showAuthPage();
    };
    
    const renderCalendar = (month, year) => {
        if(!elements.calendarGrid || !elements.monthYearHeader) return;
        elements.calendarGrid.innerHTML = '';
        elements.monthYearHeader.textContent = `${new Date(year, month).toLocaleString('default', { month: 'long' })} ${year}`;
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < firstDayOfMonth; i++) elements.calendarGrid.insertAdjacentHTML('beforeend', '<div></div>');
        for (let day = 1; day <= daysInMonth; day++) {
            const dayDate = new Date(year, month, day);
            const isPast = dayDate < today;
            const dayElement = document.createElement('div');
            dayElement.textContent = day;
            dayElement.className = 'p-2 text-center cursor-pointer rounded-full calendar-day';
            if (isPast) dayElement.classList.add('disabled'); 
            else dayElement.addEventListener('click', () => { selectedDate = dayDate; showTimeSlots(dayDate); });
            elements.calendarGrid.appendChild(dayElement);
        }
    };
    
    const showTimeSlots = (date) => {
        if(!elements.calendarView || !elements.timeSlotsView || !elements.timeSlotHeader || !elements.timeSlotsGrid) return;
        elements.calendarView.classList.add('hidden');
        elements.timeSlotsView.classList.remove('hidden');
        elements.timeSlotHeader.textContent = `Available Slots for ${date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}`;
        elements.timeSlotsGrid.innerHTML = '';
        const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"];
        timeSlots.forEach(time => {
            const slotButton = document.createElement('button');
            slotButton.textContent = time;
            slotButton.className = "p-2 border rounded-md hover:bg-blue-100 hover:border-dental-blue";
            slotButton.addEventListener('click', () => {
                const formattedDate = selectedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                if(currentCalendarTarget) currentCalendarTarget.value = `${formattedDate} - ${time}`;
                if(elements.calendarModal) elements.calendarModal.style.display = 'none';
            });
            elements.timeSlotsGrid.appendChild(slotButton);
        });
    }
    
    const openCalendar = (target) => {
        currentCalendarTarget = target;
         if(elements.calendarModal) {
            elements.calendarModal.style.display = 'flex';
            currentDate = new Date();
            renderCalendar(currentDate.getMonth(), currentDate.getFullYear());
         }
    };
    
    const showKbSubpage = (targetId) => {
        if (elements.kbMainView) elements.kbMainView.style.display = 'none';
        elements.kbSubpages.forEach(p => p.classList.remove('active'));
        const subpageToShow = document.getElementById(targetId);
        if (subpageToShow) subpageToShow.classList.add('active');
    };

    const showKbMainView = () => {
        if (elements.kbMainView) elements.kbMainView.style.display = 'block';
        elements.kbSubpages.forEach(p => p.classList.remove('active'));
    };
    
    const showTrainingKbSubpage = (targetId) => {
        if (elements.trainingKbMainView) elements.trainingKbMainView.style.display = 'none';
        elements.trainingKbSubpages.forEach(p => p.classList.remove('active'));
        const subpageToShow = document.getElementById(targetId);
        if (subpageToShow) subpageToShow.classList.add('active');
    };

    const showTrainingKbMainView = () => {
        if (elements.trainingKbMainView) elements.trainingKbMainView.style.display = 'block';
        elements.trainingKbSubpages.forEach(p => p.classList.remove('active'));
    };

    function setupEventListeners() {
        if (elements.sendOtpBtn) {
            elements.sendOtpBtn.addEventListener('click', () => {
                const phoneNumber = document.getElementById('phone-number').value;
                if (phoneNumber.length < 10) {
                    elements.authError.textContent = 'Please enter a valid 10-digit phone number.';
                    elements.authError.classList.remove('hidden');
                    return;
                }
                elements.phoneInputGroup.classList.add('hidden');
                elements.otpInputGroup.classList.remove('hidden');
                elements.authError.classList.add('hidden');
            });
        }

        if (elements.loginForm) {
            elements.loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const otp = document.getElementById('otp').value;
                if (otp === '123456') {
                    const phoneNumber = document.getElementById('phone-number').value;
                    const mailTo = 'kapilparwal@yahoo.com';
                    const subject = 'New SmileAssist Portal Registration';
                    const body = `A new user has registered.\n\nNumber: +91${phoneNumber}`;
                    const mailtoLink = `mailto:${mailTo}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                    window.open(mailtoLink, '_blank');
                    sessionStorage.setItem('isLoggedIn', 'true');
                    sessionStorage.setItem('userPhone', phoneNumber);
                    setTimeout(showPortal, 250);
                } else {
                    elements.authError.textContent = 'Invalid OTP. Please try again.';
                    elements.authError.classList.remove('hidden');
                }
            });
        }

        if (elements.logoutButton) elements.logoutButton.addEventListener('click', logout);
        if (elements.mobileLogoutButton) elements.mobileLogoutButton.addEventListener('click', logout);

        elements.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const pageId = link.getAttribute('data-page');
                if (pageId) showPage(pageId);
                if(elements.mobileMenu) elements.mobileMenu.classList.add('hidden');
            });
        });

        if (elements.mobileMenuButton) {
            elements.mobileMenuButton.addEventListener('click', () => {
                if(elements.mobileMenu) elements.mobileMenu.classList.toggle('hidden');
            });
        }

        if (elements.supportForm) {
            elements.supportForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const ticketNumber = 'SA-' + Math.floor(Math.random() * 900000 + 100000);
                elements.confirmationTitle.textContent = "Ticket Submitted Successfully!";
                elements.confirmationMessage.innerHTML = `Your support ticket <strong class="font-bold">${ticketNumber}</strong> has been created.`;
                
                const name = document.getElementById('name').value;
                const clinicName = document.getElementById('clinic_name').value;
                const email = document.getElementById('email').value;
                const phone = document.getElementById('phone').value;
                const serialNumber = document.getElementById('serial_number').value;
                const description = document.getElementById('description').value;
                const message = `*New Support Ticket Raised!*\n-------------------------\n*Ticket #:* ${ticketNumber}\n*Name:* ${name}\n*Clinic:* ${clinicName}\n*Email:* ${email}\n*Phone:* ${phone}\n*Serial #:* ${serialNumber}\n-------------------------\n*Issue:*\n${description}`.trim();
                
                const whatsappUrl = `https://wa.me/919930237370?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');
                
                if(elements.confirmationModal) elements.confirmationModal.style.display = 'flex';
                elements.supportForm.reset();
                if(elements.preferredTimeDisplay) elements.preferredTimeDisplay.value = '';
            });
        }

        if (elements.demoForm) {
            elements.demoForm.addEventListener('submit', function(e) {
                e.preventDefault();
                elements.confirmationTitle.textContent = "Demo Request Sent!";
                elements.confirmationMessage.textContent = "Thank you for your interest! We will contact you shortly to confirm your demo time.";
                
                const name = document.getElementById('demo-name').value;
                const clinicName = document.getElementById('demo-clinic-name').value;
                const email = document.getElementById('demo-email').value;
                const phone = document.getElementById('demo-phone').value;
                const equipment = document.getElementById('demo-equipment').value;
                const time = document.getElementById('demo-time-display').value;

                const mailTo = 'kapilparwal@yahoo.com';
                const subject = 'New Demo Request from SmileAssist Portal';
                const body = `A new demo has been requested.\n\n` +
                             `Name: ${name}\n` +
                             `Clinic: ${clinicName}\n` +
                             `Email: ${email}\n` +
                             `Phone: ${phone}\n` +
                             `Equipment: ${equipment}\n` +
                             `Requested Time: ${time}`;
                const mailtoLink = `mailto:${mailTo}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                window.open(mailtoLink, '_blank');

                if(elements.confirmationModal) elements.confirmationModal.style.display = 'flex';
                elements.demoForm.reset();
            });
        }


        const closeModal = () => { if(elements.confirmationModal) elements.confirmationModal.style.display = 'none'; showPage('home-page'); };
        if (elements.closeModalButton) elements.closeModalButton.addEventListener('click', closeModal);
        if (elements.confirmationModal) elements.confirmationModal.addEventListener('click', (e) => { if (e.target === elements.confirmationModal) closeModal(); });
        
        if(elements.openCalendarBtn) elements.openCalendarBtn.addEventListener('click', () => openCalendar(elements.preferredTimeDisplay));
        if(elements.openDemoCalendarBtn) elements.openDemoCalendarBtn.addEventListener('click', () => openCalendar(elements.demoTimeDisplay));

        if(elements.prevMonthBtn) elements.prevMonthBtn.addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() - 1); renderCalendar(currentDate.getMonth(), currentDate.getFullYear()); });
        if(elements.nextMonthBtn) elements.nextMonthBtn.addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() + 1); renderCalendar(currentDate.getMonth(), currentDate.getFullYear()); });
        if(elements.backToCalendarBtn) elements.backToCalendarBtn.addEventListener('click', () => { if(elements.timeSlotsView && elements.calendarView) { elements.timeSlotsView.classList.add('hidden'); elements.calendarView.classList.remove('hidden'); } });
        if(elements.calendarModal) elements.calendarModal.addEventListener('click', (e) => { if (e.target === elements.calendarModal) elements.calendarModal.style.display = 'none'; });

        elements.kbNavButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.getAttribute('data-target');
                showKbSubpage(targetId);
            });
        });
        elements.kbBackButtons.forEach(btn => btn.addEventListener('click', showKbMainView));

        elements.trainingKbNavButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.getAttribute('data-target');
                showTrainingKbSubpage(targetId);
            });
        });
        elements.trainingKbBackButtons.forEach(btn => btn.addEventListener('click', showTrainingKbMainView));
    }

    function init() {
        setupEventListeners();
        if (sessionStorage.getItem('isLoggedIn') === 'true') {
            showPortal();
        } else {
            showAuthPage();
        }
    }

    init();
});
