import './style.css'

const starterTasks = [
  {
    id: 1,
    title: 'Read Chapter One',
    subject: 'Python',
    priority: 'High',
    status: 'todo'
  },
  {
    id: 2,
    title: 'Practice Flexbox',
    subject: 'CSS',
    priority: 'Medium',
    status: 'todo'
  },
  {
    id: 3,
    title: 'Review JavaScript',
    subject: 'JavaScript',
    priority: 'Low',
    status: 'progress'
  },
  {
    id: 4,
    title: 'Build Homepage',
    subject: 'HTML',
    priority: 'High',
    status: 'progress'
  },
  {
    id: 5,
    title: 'Practice CSS Grid',
    subject: 'CSS',
    priority: 'Medium',
    status: 'done'
  },
  {
    id: 6,
    title: 'Review Final Project',
    subject: 'Web Design',
    priority: 'Low',
    status: 'done'
  }
]

let tasks = loadTasks()

const columns = [
  {
    id: 'todo',
    title: 'To Do',
    description: 'Tasks waiting to be started'
  },
  {
    id: 'progress',
    title: 'In Progress',
    description: 'Tasks currently being worked on'
  },
  {
    id: 'done',
    title: 'Done',
    description: 'Completed study tasks'
  }
]

let searchQuery = ''
let priorityFilter = 'All Priorities'

const priorityClasses = {
  High: 'bg-[#ead4d0] text-[#7d302d]',
  Medium: 'bg-[#eadfc9] text-[#765b2f]',
  Low: 'bg-[#d9e3d8] text-[#426149]'
}

function loadTasks() {
  const savedTasks = localStorage.getItem('studySprintTasks')

  if (savedTasks === null) {
    return [...starterTasks]
  }

  try {
    const parsedTasks = JSON.parse(savedTasks)

    if (Array.isArray(parsedTasks)) {
      return parsedTasks
    }

    return [...starterTasks]
  } catch {
    return [...starterTasks]
  }
}

function saveTasks() {
  localStorage.setItem(
    'studySprintTasks',
    JSON.stringify(tasks)
  )
}

function getFilteredTasks() {
  const query = searchQuery.trim().toLowerCase()

  return tasks.filter(task => {
    const matchesSearch =
      task.title.toLowerCase().includes(query) ||
      task.subject.toLowerCase().includes(query)

    const matchesPriority =
      priorityFilter === 'All Priorities' ||
      task.priority === priorityFilter

    return matchesSearch && matchesPriority
  })
}

function createTaskCard(task) {
  return `
    <article
      class="rounded-2xl border border-[#d0bda8] bg-[#fffaf2] p-5 shadow-sm transition-all duration-200 hover:-translate-y-2 hover:shadow-xl"
    >

      <div class="mb-4 flex items-start justify-between gap-3">

        <span
          class="rounded-full px-3 py-1 text-xs font-semibold ${priorityClasses[task.priority]}"
        >
          ${task.priority}
        </span>

        <div class="flex gap-1">

          <button
            data-action="edit"
            data-id="${task.id}"
            class="task-action rounded-lg px-2 py-1 text-sm text-[#705a49] transition hover:bg-[#e9ddcf] hover:text-[#26354f]"
          >
            Edit
          </button>

          <button
            data-action="delete"
            data-id="${task.id}"
            class="task-action rounded-lg px-2 py-1 text-sm text-[#873d38] transition hover:bg-[#f5e2df]"
          >
            Delete
          </button>

        </div>

      </div>

      <h3 class="mb-2 text-lg font-bold text-[#3c2c24]">
        ${task.title}
      </h3>

      <p class="mb-5 text-sm text-[#776252]">
        ${task.subject}
      </p>

      <div
        class="flex items-center justify-between border-t border-[#e2d5c6] pt-4"
      >

        <span class="text-xs font-medium text-[#806d5c]">
          Task #${task.id}
        </span>

        ${
          task.status === 'todo'
            ? `
              <button
                data-action="start"
                data-id="${task.id}"
                class="task-action rounded-lg bg-[#26354f] px-3 py-2 text-xs font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#1d293f]"
              >
                Start
              </button>
            `
            : task.status === 'progress'
            ? `
              <button
                data-action="complete"
                data-id="${task.id}"
                class="task-action rounded-lg bg-[#26354f] px-3 py-2 text-xs font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#1d293f]"
              >
                Complete
              </button>
            `
            : `
              <span class="font-semibold text-[#426149]">
                Completed
              </span>
            `
        }

      </div>

    </article>
  `
}

function renderColumn(column) {
  const filteredTasks = getFilteredTasks()

  const columnTasks = filteredTasks.filter(
    task => task.status === column.id
  )

  const totalColumnTasks = tasks.filter(
    task => task.status === column.id
  ).length

  return `
    <section
      class="rounded-3xl border border-[#cdb9a3] bg-[#e8d9c8] p-5"
    >

      <div class="mb-5">

        <div class="flex items-center justify-between">

          <h2 class="text-xl font-bold text-[#3c2c24]">
            ${column.title}
          </h2>

          <span
            class="rounded-full bg-[#26354f] px-3 py-1 text-sm font-bold text-white"
          >
            ${columnTasks.length}
          </span>

        </div>

        <p class="mt-1 text-sm text-[#776252]">
          ${column.description}
        </p>

      </div>

      <div class="space-y-4">

        ${
          columnTasks.length > 0
            ? columnTasks.map(createTaskCard).join('')
            : totalColumnTasks > 0
            ? `
              <div
                class="rounded-2xl border border-dashed border-[#bca58d] bg-[#f5ecdf] p-6 text-center text-sm text-[#806d5c]"
              >
                No tasks match the current filters.
              </div>
            `
            : `
              <div
                class="rounded-2xl border border-dashed border-[#bca58d] bg-[#f5ecdf] p-6 text-center text-sm text-[#806d5c]"
              >
                No tasks here yet.
              </div>
            `
        }

      </div>

    </section>
  `
}

function renderCalendar() {
  const today = new Date()

  const monthName = today.toLocaleString('en-US', {
    month: 'long'
  })

  const year = today.getFullYear()
  const currentDay = today.getDate()

  const firstDay = new Date(
    year,
    today.getMonth(),
    1
  ).getDay()

  const daysInMonth = new Date(
    year,
    today.getMonth() + 1,
    0
  ).getDate()

  const days = []

  for (let i = 0; i < firstDay; i++) {
    days.push('')
  }

  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day)
  }

  return `
    <div
      class="rounded-2xl border border-[#cdb9a3] bg-[#f3e7d8] p-4 shadow-sm"
    >

      <div class="mb-3 flex items-center justify-between">

        <div>

          <p
            class="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7d302d]"
          >
            Study Calendar
          </p>

          <h3 class="mt-1 text-lg font-bold text-[#3c2c24]">
            ${monthName} ${year}
          </h3>

        </div>

        <div
          class="flex h-9 w-9 items-center justify-center rounded-full bg-[#26354f] text-sm font-bold text-white shadow-sm"
        >
          ${currentDay}
        </div>

      </div>

      <div
        class="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-[#806d5c]"
      >
        <span>Su</span>
        <span>Mo</span>
        <span>Tu</span>
        <span>We</span>
        <span>Th</span>
        <span>Fr</span>
        <span>Sa</span>
      </div>

      <div class="mt-2 grid grid-cols-7 gap-1 text-center text-xs">

        ${days
          .map(day => {
            if (day === '') {
              return `<span class="h-7"></span>`
            }

            const isToday = day === currentDay

            return `
              <span
                class="flex h-7 items-center justify-center rounded-full ${
                  isToday
                    ? 'bg-[#26354f] font-bold text-white'
                    : 'text-[#4f4034]'
                }"
              >
                ${day}
              </span>
            `
          })
          .join('')}

      </div>

    </div>
  `
}

function renderStudyNote() {
  const remainingTasks =
    tasks.filter(task => task.status !== 'done').length

  return `
    <div
      class="relative h-full overflow-hidden rounded-2xl border border-[#d0bda8] bg-[#f8f1e8] p-6 shadow-sm"
    >

      <div
        class="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#7d302d] opacity-80"
      ></div>

      <div
        class="absolute bottom-0 left-0 h-1 w-full bg-[#a97945]"
      ></div>

      <div class="relative z-10">

        <p
          class="text-[10px] font-bold uppercase tracking-[0.25em] text-[#7d302d]"
        >
          Today's Focus
        </p>

        <div class="mt-5">

          <p
            class="font-serif text-2xl font-bold leading-9 text-[#26354f]"
          >
            “Small progress is still progress.”
          </p>

          <div class="my-5 h-px w-16 bg-[#a97945]"></div>

          <p class="text-sm leading-6 text-[#705a49]">
            Keep your attention on one task at a time.
            A focused study session can make a big difference.
          </p>

        </div>

        <div
          class="mt-6 rounded-xl border border-[#d0bda8] bg-white/50 p-4"
        >

          <p class="text-xs uppercase tracking-widest text-[#806d5c]">
            Remaining Tasks
          </p>

          <p class="mt-1 text-2xl font-bold text-[#26354f]">
            ${remainingTasks}
          </p>

        </div>

      </div>

    </div>
  `
}

function renderBoard() {
  const app = document.querySelector('#app')

  const totalTasks = tasks.length

  const todoTasks = tasks.filter(
    task => task.status === 'todo'
  ).length

  const progressTasks = tasks.filter(
    task => task.status === 'progress'
  ).length

  const completedTasks = tasks.filter(
    task => task.status === 'done'
  ).length

  const completion =
    totalTasks === 0
      ? 0
      : Math.round(
          (completedTasks / totalTasks) * 100
        )

  app.innerHTML = `
    <div
      dir="ltr"
      class="min-h-screen bg-[#cbb69d] px-3 py-5 sm:px-6 sm:py-8"
    >

      <div
        class="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-[#b9a289] bg-[#f5eadc] shadow-2xl"
      >

        <header
          class="relative overflow-hidden border-b border-[#b9a289] bg-[#dfc8ad] px-6 py-8 sm:px-10"
        >

          <div
            class="absolute right-0 top-0 h-full w-1/3 bg-[#7d302d] opacity-10"
          ></div>

          <div
            class="absolute bottom-0 left-0 h-1 w-full bg-[#26354f]"
          ></div>

          <div
            class="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between"
          >

            <div class="max-w-2xl">

              <h1
                class="font-serif text-4xl font-bold tracking-tight text-[#3c2c24] sm:text-5xl"
              >
                Study Sprint
              </h1>

              <p
                class="mt-3 max-w-xl text-sm leading-6 text-[#705a49] sm:text-base"
              >
                A quiet space to organize your studies,
                follow your progress, and make every
                study session count.
              </p>

            </div>

            <div class="flex items-center gap-4">

              <div class="hidden text-right sm:block">

                <p
                  class="text-xs uppercase tracking-widest text-[#806d5c]"
                >
                  Study Edition
                </p>

                <p
                  class="mt-1 text-lg font-semibold text-[#3c2c24]"
                >
                  Focus · Learn · Grow
                </p>

              </div>

              <button
                id="add-task-button"
                class="rounded-xl bg-[#26354f] px-5 py-3 font-semibold text-white shadow-md transition-all duration-200 hover:-translate-y-1 hover:bg-[#1d293f] hover:shadow-lg"
              >
                + Add Task
              </button>

            </div>

          </div>

        </header>

        <div class="p-5 sm:p-8 lg:p-10">

          <section class="mb-8">

            <div class="mb-5 flex items-end justify-between gap-4">

              <div>

                <p
                  class="text-xs font-bold uppercase tracking-[0.25em] text-[#7d302d]"
                >
                  Your Overview
                </p>

                <h2
                  class="mt-1 font-serif text-2xl font-bold text-[#3c2c24]"
                >
                  Study Dashboard
                </h2>

              </div>

              <div
                class="hidden text-sm text-[#806d5c] sm:block"
              >
                Keep going — every task counts.
              </div>

            </div>

            <div
              class="grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
            >

              <div
                class="group rounded-2xl border border-[#d0bda8] border-t-4 border-t-[#26354f] bg-[#fffaf2] p-5 shadow-sm transition-all duration-200 hover:-translate-y-2 hover:shadow-xl"
              >
                <p class="text-sm text-[#806d5c]">
                  Total Tasks
                </p>

                <p
                  class="mt-2 text-3xl font-bold text-[#3c2c24] transition-colors group-hover:text-[#26354f]"
                >
                  ${totalTasks}
                </p>
              </div>

              <div
                class="group rounded-2xl border border-[#d0bda8] border-t-4 border-t-[#9a704b] bg-[#fffaf2] p-5 shadow-sm transition-all duration-200 hover:-translate-y-2 hover:shadow-xl"
              >
                <p class="text-sm text-[#806d5c]">
                  To Do
                </p>

                <p
                  class="mt-2 text-3xl font-bold text-[#3c2c24] transition-colors group-hover:text-[#9a704b]"
                >
                  ${todoTasks}
                </p>
              </div>

              <div
                class="group rounded-2xl border border-[#d0bda8] border-t-4 border-t-[#7d302d] bg-[#fffaf2] p-5 shadow-sm transition-all duration-200 hover:-translate-y-2 hover:shadow-xl"
              >
                <p class="text-sm text-[#806d5c]">
                  In Progress
                </p>

                <p
                  class="mt-2 text-3xl font-bold text-[#3c2c24] transition-colors group-hover:text-[#7d302d]"
                >
                  ${progressTasks}
                </p>
              </div>

              <div
                class="group rounded-2xl border border-[#d0bda8] border-t-4 border-t-[#4f7357] bg-[#fffaf2] p-5 shadow-sm transition-all duration-200 hover:-translate-y-2 hover:shadow-xl"
              >
                <p class="text-sm text-[#806d5c]">
                  Completed
                </p>

                <p
                  class="mt-2 text-3xl font-bold text-[#3c2c24] transition-colors group-hover:text-[#4f7357]"
                >
                  ${completedTasks}
                </p>
              </div>

              <div
                class="group rounded-2xl border border-[#d0bda8] border-t-4 border-t-[#26354f] bg-[#fffaf2] p-5 shadow-sm transition-all duration-200 hover:-translate-y-2 hover:shadow-xl"
              >

                <p class="text-sm text-[#806d5c]">
                  Completion
                </p>

                <div
                  class="mt-2 flex items-end justify-between"
                >

                  <p
                    class="text-3xl font-bold text-[#26354f]"
                  >
                    ${completion}%
                  </p>

                  <span
                    class="text-xs font-semibold text-[#806d5c]"
                  >
                    Progress
                  </span>

                </div>

                <div
                  class="mt-3 h-2 overflow-hidden rounded-full bg-[#e6d8c8]"
                >

                  <div
                    class="h-full rounded-full bg-[#7d302d] transition-all duration-500"
                    style="width: ${completion}%"
                  ></div>

                </div>

              </div>

            </div>

          </section>

          <section class="mb-8 grid gap-5 lg:grid-cols-[300px_1fr]">

            <div>
              ${renderCalendar()}
            </div>

            <div>
              ${renderStudyNote()}
            </div>

          </section>

          <section
            id="add-task-form-container"
            class="mb-8 hidden rounded-3xl border border-[#d0bda8] bg-[#fffaf2] p-6 shadow-sm"
          >

            <div class="mb-6">

              <p
                class="text-xs font-bold uppercase tracking-widest text-[#7d302d]"
              >
                New Entry
              </p>

              <h2
                class="mt-1 font-serif text-2xl font-bold text-[#3c2c24]"
              >
                Add New Task
              </h2>

              <p
                class="mt-1 text-sm text-[#806d5c]"
              >
                Add a new study task to your board.
              </p>

            </div>

            <form
              id="add-task-form"
              class="grid gap-5 md:grid-cols-3"
            >

              <div>

                <label
                  for="task-title"
                  class="mb-2 block text-sm font-semibold text-[#3c2c24]"
                >
                  Title
                </label>

                <input
                  id="task-title"
                  type="text"
                  placeholder="e.g. Study Python"
                  class="h-12 w-full rounded-xl border border-[#d0bda8] bg-white px-4 text-sm outline-none focus:border-[#26354f] focus:ring-2 focus:ring-[#26354f]/20"
                />

              </div>

              <div>

                <label
                  for="task-subject"
                  class="mb-2 block text-sm font-semibold text-[#3c2c24]"
                >
                  Subject
                </label>

                <input
                  id="task-subject"
                  type="text"
                  placeholder="e.g. Python"
                  class="h-12 w-full rounded-xl border border-[#d0bda8] bg-white px-4 text-sm outline-none focus:border-[#26354f]"
                />

              </div>

              <div>

                <label
                  for="task-priority"
                  class="mb-2 block text-sm font-semibold text-[#3c2c24]"
                >
                  Priority
                </label>

                <select
                  id="task-priority"
                  class="h-12 w-full rounded-xl border border-[#d0bda8] bg-white px-4 text-sm outline-none focus:border-[#26354f]"
                >

                  <option value="Low">
                    Low
                  </option>

                  <option
                    value="Medium"
                    selected
                  >
                    Medium
                  </option>

                  <option value="High">
                    High
                  </option>

                </select>

              </div>

              <div class="md:col-span-3">

                <p
                  id="form-error"
                  class="mb-4 hidden rounded-xl bg-[#f5e2df] px-4 py-3 text-sm font-medium text-[#7d302d]"
                ></p>

                <div class="flex flex-wrap gap-3">

                  <button
                    type="submit"
                    class="rounded-xl bg-[#26354f] px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#1d293f]"
                  >
                    Add Task
                  </button>

                  <button
                    type="button"
                    id="cancel-add-task"
                    class="rounded-xl border border-[#d0bda8] bg-[#e8d9c8] px-6 py-3 font-semibold text-[#6f513b] transition hover:-translate-y-0.5 hover:bg-[#ddcbb8]"
                  >
                    Cancel
                  </button>

                </div>

              </div>

            </form>

          </section>

          <section
            class="mb-8 rounded-3xl border border-[#d0bda8] bg-[#fffaf2] p-5 shadow-sm"
          >

            <div
              class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
            >

              <div class="w-full md:w-[420px]">

                <label
                  for="search-input"
                  class="mb-2 block text-sm font-semibold text-[#3c2c24]"
                >
                  Search
                </label>

                <input
                  id="search-input"
                  type="text"
                  value="${searchQuery}"
                  placeholder="Search tasks..."
                  class="h-12 w-full rounded-xl border border-[#d0bda8] bg-white px-4 text-sm outline-none focus:border-[#26354f] focus:ring-2 focus:ring-[#26354f]/20"
                />

              </div>

              <div class="flex flex-wrap gap-3">

                <select
                  id="priority-filter"
                  class="h-12 rounded-xl border border-[#d0bda8] bg-white px-4 text-sm text-[#3c2c24] outline-none focus:border-[#26354f]"
                >

                  <option
                    ${priorityFilter === 'All Priorities' ? 'selected' : ''}
                  >
                    All Priorities
                  </option>

                  <option
                    ${priorityFilter === 'High' ? 'selected' : ''}
                  >
                    High
                  </option>

                  <option
                    ${priorityFilter === 'Medium' ? 'selected' : ''}
                  >
                    Medium
                  </option>

                  <option
                    ${priorityFilter === 'Low' ? 'selected' : ''}
                  >
                    Low
                  </option>

                </select>

                <button
                  id="clear-filters"
                  class="h-12 rounded-xl border border-[#d0bda8] bg-[#e8d9c8] px-4 text-sm font-semibold text-[#6f513b] transition hover:-translate-y-0.5 hover:bg-[#ddcbb8]"
                >
                  Clear Filters
                </button>

                <button
                  id="reset-board"
                  class="h-12 rounded-xl border border-[#c99b95] bg-[#f5e2df] px-4 text-sm font-semibold text-[#7d302d] transition hover:-translate-y-0.5 hover:bg-[#ead0cc]"
                >
                  Reset Board
                </button>

              </div>

            </div>

          </section>

          <main class="grid gap-6 lg:grid-cols-3">
            ${columns.map(renderColumn).join('')}
          </main>

        </div>

        <footer
          class="border-t border-[#b9a289] bg-[#dfc8ad] px-6 py-5 text-center"
        >

          <p
            class="text-xs font-medium uppercase tracking-[0.2em] text-[#705a49]"
          >
            Study Sprint · Focus on what matters
          </p>

        </footer>

      </div>

    </div>
  `

  setupAddTask()
  setupTaskActions()
  setupFilters()
  setupResetBoard()
}

function setupAddTask() {
  const addButton =
    document.querySelector('#add-task-button')

  const formContainer =
    document.querySelector(
      '#add-task-form-container'
    )

  const form =
    document.querySelector('#add-task-form')

  const cancelButton =
    document.querySelector('#cancel-add-task')

  const errorMessage =
    document.querySelector('#form-error')

  addButton.addEventListener('click', () => {
    formContainer.classList.toggle('hidden')
  })

  cancelButton.addEventListener('click', () => {
    form.reset()
    errorMessage.textContent = ''
    errorMessage.classList.add('hidden')
    formContainer.classList.add('hidden')
  })

  form.addEventListener('submit', event => {
    event.preventDefault()

    const title = document
      .querySelector('#task-title')
      .value
      .trim()

    const subject = document
      .querySelector('#task-subject')
      .value
      .trim()

    const priority =
      document.querySelector(
        '#task-priority'
      ).value

    if (!title || !subject) {
      errorMessage.textContent =
        'Please enter both a title and a subject.'

      errorMessage.classList.remove('hidden')

      return
    }

    tasks.push({
      id: Date.now(),
      title,
      subject,
      priority,
      status: 'todo'
    })

    saveTasks()
    renderBoard()
  })
}

function setupTaskActions() {
  const buttons =
    document.querySelectorAll('.task-action')

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const taskId =
        Number(button.dataset.id)

      const action =
        button.dataset.action

      const task =
        tasks.find(
          task => task.id === taskId
        )

      if (!task) return

      if (action === 'start') {
        task.status = 'progress'
        saveTasks()
      }

      if (action === 'complete') {
        task.status = 'done'
        saveTasks()
      }

      if (action === 'delete') {
        const confirmed = confirm(
          'Are you sure you want to delete this task?'
        )

        if (!confirmed) return

        tasks = tasks.filter(
          task => task.id !== taskId
        )

        saveTasks()
      }

      if (action === 'edit') {
        const newTitle = prompt(
          'Enter a new title:',
          task.title
        )

        if (newTitle === null) return

        const newSubject = prompt(
          'Enter a new subject:',
          task.subject
        )

        if (newSubject === null) return

        const newPriority = prompt(
          'Enter priority: Low, Medium, or High',
          task.priority
        )

        if (newPriority === null) return

        const priority =
          newPriority.trim()

        if (
          !newTitle.trim() ||
          !newSubject.trim()
        ) {
          alert(
            'Title and subject cannot be empty.'
          )

          return
        }

        if (
          !['Low', 'Medium', 'High'].includes(
            priority
          )
        ) {
          alert(
            'Priority must be Low, Medium, or High.'
          )

          return
        }

        task.title =
          newTitle.trim()

        task.subject =
          newSubject.trim()

        task.priority =
          priority

        saveTasks()
      }

      renderBoard()
    })
  })
}

function setupFilters() {
  const searchInput =
    document.querySelector(
      '#search-input'
    )

  const prioritySelect =
    document.querySelector(
      '#priority-filter'
    )

  const clearButton =
    document.querySelector(
      '#clear-filters'
    )

  searchInput.addEventListener(
    'input',
    event => {
      searchQuery =
        event.target.value

      renderBoard()
    }
  )

  prioritySelect.addEventListener(
    'change',
    event => {
      priorityFilter =
        event.target.value

      renderBoard()
    }
  )

  clearButton.addEventListener(
    'click',
    () => {
      searchQuery = ''
      priorityFilter =
        'All Priorities'

      renderBoard()
    }
  )
}

function setupResetBoard() {
  const resetButton =
    document.querySelector(
      '#reset-board'
    )

  resetButton.addEventListener(
    'click',
    () => {
      const confirmed = confirm(
        'Reset the board and restore the starter tasks?'
      )

      if (!confirmed) return

      tasks = [...starterTasks]

      saveTasks()

      searchQuery = ''
      priorityFilter =
        'All Priorities'

      renderBoard()
    }
  )
}

renderBoard()