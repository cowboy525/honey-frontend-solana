import React, { useState } from 'react';
import * as styles from './LiquidateSidebar.css';
import { LendSidebarProps } from './types';
import HoneyTabs, { HoneyTabItem } from '../HoneyTabs/HoneyTabs';
import EmptyStateDetails from '../EmptyStateDetails/EmptyStateDetails';
import BidForm from '../BidForm/BidForm';
import BidsList from '../BidsList/BidsList';
import { useConnectedWallet } from '@saberhq/use-solana';
import { useWalletKit } from '@gokiprotocol/walletkit';
import { useMediaQuery } from 'react-responsive';
import { MQ_DESKTOP_BP } from 'constants/breakpoints';

const items: [HoneyTabItem, HoneyTabItem] = [
  { label: 'Place a bid', key: 'bid' },
  { label: 'Current bids', key: 'current' }
];

type Tab = 'bid' | 'current';

const LiquidateSidebar = (props: LendSidebarProps) => {
  const {
    collectionId,
    userBalance,
    isFetchingBids,
    biddingArray,
    highestBiddingValue,
    highestBiddingAddress,
    currentUserBid,
    fetchedReservePrice,
    currentMarketId,
    stringyfiedWalletPK,
    isFetchingData,
    handleRevokeBid,
    handleIncreaseBid,
    handlePlaceBid,
    onCancel,
    isLoadingWalletBalance,
    loanCurrency
  } = props;
  const isMobile = useMediaQuery({ maxWidth: MQ_DESKTOP_BP });
  const wallet = useConnectedWallet();
  const { connect } = useWalletKit();
  const [activeTab, setActiveTab] = useState<Tab>('bid');

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey as Tab);
  };

  return (
    <div className={styles.liquidateSidebarContainer}>
      <HoneyTabs
        activeKey={activeTab}
        onTabChange={handleTabChange}
        items={items}
        active={Boolean(collectionId)}
      >
        {!wallet ? (
          <EmptyStateDetails
            icon={<div className={styles.lightIcon} />}
            title="You didn’t connect any wallet yet"
            description="First, choose a NFT collection"
            buttons={
              isMobile
                ? [
                    {
                      title: 'CONNECT',
                      onClick: connect
                    },
                    {
                      title: 'RETURN',
                      onClick: () => onCancel(),
                      variant: 'secondary'
                    }
                  ]
                : [
                    {
                      title: 'CONNECT',
                      onClick: connect
                    }
                  ]
            }
          />
        ) : !collectionId ? (
          <EmptyStateDetails
            icon={<div className={styles.boltIcon} />}
            title="Manage panel"
            description="First, choose a NFT collection"
          />
        ) : (
          <>
            {activeTab === 'bid' && (
              <BidForm
                currentUserBid={currentUserBid}
                highestBiddingAddress={highestBiddingAddress}
                userBalance={userBalance}
                stringyfiedWalletPK={stringyfiedWalletPK}
                highestBiddingValue={highestBiddingValue}
                handleRevokeBid={handleRevokeBid}
                handleIncreaseBid={handleIncreaseBid}
                handlePlaceBid={handlePlaceBid}
                fetchedReservePrice={fetchedReservePrice}
                onCancel={onCancel}
                currentMarketId={currentMarketId}
                isFetchingData={isFetchingData}
                isLoadingWalletBalance={isLoadingWalletBalance}
                isFetchingBids={isFetchingBids}
              />
            )}
            {activeTab === 'current' && (
              <BidsList
                isFetchingData={isFetchingBids}
                biddingArray={biddingArray}
                fetchedReservePrice={fetchedReservePrice}
                loanCurrency={loanCurrency}
              />
            )}
          </>
        )}
      </HoneyTabs>
    </div>
  );
};

export default LiquidateSidebar;
