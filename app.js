document.addEventListener('DOMContentLoaded', function () {
  const WORK_START = 9;
  const WORK_END = 17;
  const STORAGE_KEY = 'dayPlannerTasks';
  const planner = document.getElementById('planner');
  const toast = document.getElementById('toast');
  const header = document.getElementById('main-header');
  const menuToggle = document.getElementById('menu-toggle');

  // Device detection
  function isMobile() {
    return window.innerWidth <= 600;
  }

  // Toast notification
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 1800);
  }

  // Load tasks from localStorage
  function loadTasks() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  }

  // Save tasks to localStorage
  function saveTasks(tasks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  // Format hour label
  function formatHour(hour) {
    if (hour === 12) return '12 PM';
    if (hour === 0 || hour === 24) return '12 AM';
    if (hour > 12) return (hour - 12) + ' PM';
    return hour + ' AM';
  }

  // Create time blocks dynamically
  function createTimeBlocks() {
    planner.innerHTML = '';
    const tasks = loadTasks();
    for (let hour = WORK_START; hour <= WORK_END; hour++) {
      const block = document.createElement('div');
      block.className = 'time-block';
      block.setAttribute('data-hour', hour);

      const label = document.createElement('div');
      label.className = 'hour-label';
      label.textContent = formatHour(hour);

      const textarea = document.createElement('textarea');
      textarea.className = 'task-input';
      textarea.placeholder = 'Enter your task...';
      textarea.value = tasks[hour] || '';
      textarea.setAttribute('aria-label', `Task for ${formatHour(hour)}`);
      autoResizeTextarea(textarea);
      textarea.addEventListener('input', function () {
        autoResizeTextarea(textarea);
      });

      const button = document.createElement('button');
      button.className = 'save-btn';
      button.textContent = 'Save';
      button.setAttribute('aria-label', `Save task for ${formatHour(hour)}`);
      button.addEventListener('click', function () {
        const allTasks = loadTasks();
        allTasks[hour] = textarea.value;
        saveTasks(allTasks);
        showToast('Task saved!');
      });

      block.appendChild(label);
      block.appendChild(textarea);
      block.appendChild(button);
      planner.appendChild(block);
    }
  }

  // Color code time blocks
  function updateTimeBlockColors() {
    const now = new Date();
    const currentHour = now.getHours();
    document.querySelectorAll('.time-block').forEach(block => {
      const hour = parseInt(block.getAttribute('data-hour'), 10);
      block.classList.remove('past', 'present', 'future');
      if (hour < currentHour) {
        block.classList.add('past');
      } else if (hour === currentHour) {
        block.classList.add('present');
      } else {
        block.classList.add('future');
      }
    });
  }

  // Auto-resize textarea
  function autoResizeTextarea(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = (textarea.scrollHeight + 2) + 'px';
  }

  // Responsive logic: re-create blocks and adjust on resize
  function handleResize() {
    createTimeBlocks();
    updateTimeBlockColors();
    // Show menu toggle on mobile
    if (isMobile()) {
      menuToggle.style.display = 'block';
    } else {
      menuToggle.style.display = 'none';
    }
  }

  // Sticky/collapsible header on scroll (mobile)
  function handleScroll() {
    if (isMobile()) {
      if (window.scrollY > 20) {
        header.classList.add('shrink');
      } else {
        header.classList.remove('shrink');
      }
    } else {
      header.classList.remove('shrink');
    }
  }

  // (Optional) Menu toggle placeholder
  menuToggle.addEventListener('click', function () {
    showToast('Menu toggle (future feature)');
  });

  // Initial load
  createTimeBlocks();
  updateTimeBlockColors();
  handleResize();

  // Update color coding every minute
  setInterval(updateTimeBlockColors, 60000);

  // Responsive: re-create blocks on resize
  window.addEventListener('resize', handleResize);
  window.addEventListener('orientationchange', handleResize);

  // Sticky header on scroll
  window.addEventListener('scroll', handleScroll);
});
