import { getCoinData, getTrending } from '@/lib/coingecko.actions'
import DataTable from '@/component/DataTable'
import React from 'react'


const page = async () => {
  const trending = await getTrending();
  const btcData = await getCoinData('bitcoin');

  return <main className="main-container">
    <section className="home-grid">
      <div id="coin-overview">
        <div className="header">
          <img
            src={btcData?.image || "/images/bitcoin.png"}
            width="30"
            height="30"
            alt="bitcoin"
          />

          <div className='info'>
            <p>{btcData?.name || "Bitcoin"} / {btcData?.symbol?.toUpperCase() || "BTC"}</p>
            <h1>{(btcData?.current_price || 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</h1>
          </div>
        </div>
      </div>

      <p>Trending Coins</p>
      <DataTable data={trending} />
    </section>
    <section className="w-full mt-7 space-y-4">
      <p>Categories</p>
    </section>
  </main>
}

export default page
