import {useState} from 'react';

function CreateEscrow() {
  const [buyerPKH, setBuyerPKH] = useState('');
  const [sellerPKH, setSellerPKH] = useState('');
  const [arbiterPKH, setArbiterPKH] = useState('');
  const [depositAmount, setDepositAmount] = useState('');

  function validateForm() {
    if (!buyerPKH || !sellerPKH || !arbiterPKH || !depositAmount) {
      alert("Please fill in all fields.");
      return false;
    } 
    if (Number(depositAmount) <= 0) {
      alert("Deposit amount must be greater than zero");
      return false;
    }
    return true;
  }

  function handleCreateEscrow() {
    if (!validateForm()) return;
    console.log("Form is valid!");
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">

      {/* Page Header */}
      <section className="mb-10">
        <h1 className="text-4xl font-bold text-slate-900">
          Create Escrow
        </h1>

        <p className="mt-2 text-slate-600">
          Create a new Bitcoin Cash escrow secured by a CashScript smart contract.
        </p>
      </section>

      {/* Main Content */}
      <div className="grid gap-8 lg:grid-cols-3">

        {/* ================= LEFT COLUMN ================= */}
        <section className="space-y-6 lg:col-span-2">

          {/* Escrow Details */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="mb-5 text-xl font-semibold">
              Escrow Details
            </h2>

            {/* Buyer */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium">
                Buyer Public Key Hash
              </label>

              <input
                type="text"
                placeholder="20-byte Buyer PKH"
                value={buyerPKH}
                onChange={(e) => setBuyerPKH(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2"
              />
            </div>

            {/* Seller */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium">
                Seller Public Key Hash
              </label>

              <input
                type="text"
                placeholder="20-byte Seller PKH"
                value={sellerPKH}
                onChange={(e) => setSellerPKH(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2"
              />
            </div>

            {/* Arbiter */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium">
                Arbiter Public Key Hash
              </label>

              <input
                type="text"
                placeholder="20-byte Arbiter PKH"
                value={arbiterPKH}
                onChange={(e) => setArbiterPKH(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2"
              />
            </div>

            {/* Deposit */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Deposit Amount (BCH)
              </label>

              <input
                type="number"
                placeholder="0.00"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2"
              />
            </div>

          </div>

        </section>

        {/* ================= RIGHT COLUMN ================= */}

        <aside className="space-y-6">

          {/* Wallet Status */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="mb-4 text-lg font-semibold">
              Wallet
            </h2>

            <p className="text-sm text-slate-600">
              Status
            </p>

            <p className="mt-1 font-medium text-red-500">
              Not Connected
            </p>

            <button className="mt-5 w-full rounded-lg bg-slate-900 py-2 text-white hover:bg-slate-700">
              Connect Wallet
            </button>

          </div>

          {/* Contract Preview */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="mb-4 text-lg font-semibold">
              Smart Contract
            </h2>

            <div className="space-y-3 text-sm">

              <div className="flex justify-between">
                <span>Network</span>
                <span>Chipnet</span>
              </div>

              <div className="flex justify-between">
                <span>Contract</span>
                <span>TrustLock</span>
              </div>

              <div className="flex justify-between">
                <span>Status</span>
                <span>Ready</span>
              </div>

            </div>

          </div>

          {/* Create Button */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

            <button
              className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
              onClick={handleCreateEscrow}
            >
              Create Escrow
            </button>

          </div>

        </aside>

      </div>

    </main>
  );
}

export default CreateEscrow;