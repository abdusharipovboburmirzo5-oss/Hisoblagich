// Elements
const themeToggle=document.getElementById('themeToggle');
const openWidget=document.getElementById('openWidget');
const modal=document.getElementById('widgetModal');
const closeModal=document.querySelector('.close');

const description=document.getElementById('description');
const amount=document.getElementById('amount');
const type=document.getElementById('type');
const addBtn=document.getElementById('addBtn');
const historyList=document.getElementById('historyList');
const clearBtn=document.getElementById('clearBtn');

const incomeTotalEl=document.getElementById('incomeTotal');
const expenseTotalEl=document.getElementById('expenseTotal');
const totalBalanceEl=document.getElementById('totalBalance');
const ctx=document.getElementById('balanceChart').getContext('2d');

let transactions=JSON.parse(localStorage.getItem('transactions'))||[];

let chart=new Chart(ctx,{
  type:'doughnut',
  data:{ labels:['Daromad','Xarajat'], datasets:[{ data:[0,0], backgroundColor:['green','red'] }] },
  options:{ responsive:true }
});

function updateDashboard(){
  let income=transactions.filter(t=>t.type==='income').reduce((a,t)=>a+t.amount,0);
  let expense=transactions.filter(t=>t.type==='expense').reduce((a,t)=>a+t.amount,0);
  let total=income-expense;

  incomeTotalEl.textContent=income.toLocaleString()+' UZS';
  expenseTotalEl.textContent=expense.toLocaleString()+' UZS';
  totalBalanceEl.textContent=total.toLocaleString()+' UZS';

  chart.data.datasets[0].data=[income,expense];
  chart.update();

  historyList.innerHTML='';
  transactions.forEach((t,i)=>{
    const li=document.createElement('li');
    li.innerHTML=`${t.description}: ${t.amount.toLocaleString()} UZS <button onclick="deleteTransaction(${i})">❌</button>`;
    historyList.appendChild(li);
  });

  localStorage.setItem('transactions',JSON.stringify(transactions));
}

addBtn.addEventListener('click',()=>{
  if(!description.value||!amount.value)return alert('Iltimos maydonlarni to‘ldiring!');
  transactions.push({description:description.value, amount:+amount.value, type:type.value});
  description.value=''; amount.value='';
  updateDashboard();
});

function deleteTransaction(i){ transactions.splice(i,1); updateDashboard(); }
clearBtn.addEventListener('click',()=>{ if(confirm('Haqiqatan ham hammasini o‘chirmoqchimisiz?')){ transactions=[]; updateDashboard(); } });

themeToggle.addEventListener('click', ()=>{
  document.body.classList.toggle('dark');

  // Show stars only in dark mode
  if(document.body.classList.contains('dark')){
    canvas.style.display = 'block';
  } else {
    canvas.style.display = 'none';
  }

  themeToggle.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
});


openWidget.addEventListener('click',()=>{ modal.style.display='block'; });
closeModal.addEventListener('click',()=>{ modal.style.display='none'; });
window.addEventListener('click',e=>{ if(e.target===modal) modal.style.display='none'; });

updateDashboard();
