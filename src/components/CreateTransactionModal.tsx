import React from 'react'
import Modal from './Modal'
import TransactionForm from './TransactionForm'

export default function CreateTransactionModal({ createModalRef, handleSaved, closeModal }) {
  return (
    <Modal ref={createModalRef} title="Nova Transação">
      <div id="transaction-modal">
        <TransactionForm
          key={'create-modal'}
          onSaved={handleSaved}
          onCancel={closeModal}
        />
      </div>
    </Modal>
  )
}
