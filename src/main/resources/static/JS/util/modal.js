function openModal({ title, message, showCancel = false }) {
  return new Promise(resolve => {
    const root = document.getElementById('app-modal-root')
    const template = document.getElementById('app-modal-template')

    const modal = template.content.cloneNode(true)
    modal.querySelector('.modal-title').textContent = title
    modal.querySelector('.modal-message').textContent = message

    const cancelBtn = modal.querySelector('.cancel')
    const confirmBtn = modal.querySelector('.confirm')

    if (!showCancel) cancelBtn.style.display = 'none'

    confirmBtn.onclick = () => {
      root.innerHTML = ''
      resolve(true)
    }

    cancelBtn.onclick = () => {
      root.innerHTML = ''
      resolve(false)
    }

    root.appendChild(modal)
  })
}

export const AppAlert = (msg, title = "알림") =>
  openModal({ title, message: msg })

export const AppConfirm = (msg, title = "확인") =>
  openModal({ title, message: msg, showCancel: true })
