// 🧠 Assign task to least busy member in that team

function assignTask(newTask, TEAM, tasks) {

  // 🔥 Get members of that specific team (frontend/backend/etc)
  const teamMembers = TEAM[newTask.type];

  // ❗ Safety check
  if (!teamMembers || teamMembers.length === 0) {
    console.warn("No team members found for type:", newTask.type);
    return { id: null };
  }

  // 🔥 Step 1: Initialize workload count
  const workload = {};

  teamMembers.forEach(member => {
    workload[member.id] = 0;
  });

  // 🔥 Step 2: Count existing tasks per member
  tasks.forEach(task => {
    if (task.type === newTask.type) { 
      if (workload[task.assignee] !== undefined) {
        workload[task.assignee]++;
      }
    }
  });

  // 🔥 Step 3: Find least busy member
  let minTasks = Infinity;
  let selectedMember = teamMembers[0];

  teamMembers.forEach(member => {
    if (workload[member.id] < minTasks) {
      minTasks = workload[member.id];
      selectedMember = member;
    }
  });

  console.log("🧠 Assigned to:", selectedMember.name, "| Tasks:", minTasks);

  return selectedMember;
}

export default assignTask;