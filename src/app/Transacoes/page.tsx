import { Button } from "@/components";
import BalanceCard from "@/components/BalanceCard";
import { FiPlus } from "react-icons/fi";

import PageHeading from "@/components/PageHeading";
import RequireAuth from "@/components/RequireAuth";
import TransactionsFilters from "@/components/TransactionsFilters";
import TransactionsTable from "@/components/TransactionsTable";
import { useRef } from "react";

export default function Transacoes() {
  const transactionTableRef = useRef(null)

  const handleOpenNewTransactionModal = () => {
    if (transactionTableRef.current) {
      transactionTableRef.current?.openCreateModal()
    }
  }

  return (
    <RequireAuth>
      <div className="p-16">
        <header className="flex items-center justify-between">
          <PageHeading
            title="Todas as transações"
            subtitle="Gerencie e visualize todas as suas transações"
          />

          <Button
            onClick={handleOpenNewTransactionModal}
            variant="primary"
            className="w-full md:w-auto shrink-0"
            aria-haspopup="dialog"
            aria-controls="transaction-modal"
          >
            <span className="inline-flex items-center justify-center gap-2">
              <FiPlus aria-hidden />
              Adicionar Transação
            </span>
          </Button>
        </header>

        <BalanceCard isTransaction />
        <TransactionsFilters />
        <TransactionsTable transactionTableRef={transactionTableRef} />
      </div>
    </RequireAuth>
  );
}
