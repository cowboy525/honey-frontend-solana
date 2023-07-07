import React, { useState } from 'react';
import * as styles from './LendSidebar.css';
import { LendSidebarProps } from './types';
import DepositForm from '../DepositForm/DepositForm';
import WithdrawForm from '../WithdrawForm/WithdrawForm';
import HoneyTabs, { HoneyTabItem } from '../HoneyTabs/HoneyTabs';
import EmptyStateDetails from '../EmptyStateDetails/EmptyStateDetails';
import { useConnectedWallet } from '@saberhq/use-solana';
import { useWalletKit } from '@gokiprotocol/walletkit';
import { mobileReturnButton } from 'styles/common.css';
import { useMediaQuery } from 'react-responsive';
import { MQ_DESKTOP_BP } from 'constants/breakpoints';

const items: [HoneyTabItem, HoneyTabItem] = [
  { label: 'Deposit', key: 'deposit' },
  { label: 'Withdraw', key: 'withdraw' }
];

type Tab = 'deposit' | 'withdraw';

const LendSidebar = (props: LendSidebarProps) => {
  const {
    collectionId,
    executeDeposit,
    executeWithdraw,
    userTotalDeposits,
    available,
    value,
    userWalletBalance,
    fetchedReservePrice,
    marketImage,
    currentMarketId,
    onCancel,
    activeInterestRate,
    isFetchingData
  } = props;
  const isMobile = useMediaQuery({ maxWidth: MQ_DESKTOP_BP });
  const wallet = useConnectedWallet();
  const { connect } = useWalletKit();
  const [activeTab, setActiveTab] = useState<Tab>('deposit');

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey as Tab);
  };
  return (
    <div className={styles.lendSidebarContainer}>
      <HoneyTabs
        activeKey={activeTab}
        onTabChange={handleTabChange}
        items={items}
        active={true}
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
                      onClick: connect,
                      variant: 'primary'
                    },
                    {
                      title: 'RETURN',
                      onClick: () => onCancel(),
                      variant: 'secondary',
                      className: mobileReturnButton
                    }
                  ]
                : [
                    {
                      title: 'CONNECT',
                      onClick: connect,
                      variant: 'primary'
                    }
                  ]
            }
          />
        ) : !currentMarketId ? (
          <EmptyStateDetails
            icon={<div className={styles.boltIcon} />}
            title="Manage panel"
            description="First, choose a NFT collection"
          />
        ) : (
          <>
            {activeTab === 'deposit' && (
              <DepositForm
                executeDeposit={executeDeposit}
                userTotalDeposits={userTotalDeposits}
                available={available}
                value={value}
                userWalletBalance={userWalletBalance}
                fetchedReservePrice={fetchedReservePrice}
                marketImage={marketImage}
                currentMarketId={currentMarketId}
                onCancel={onCancel}
                activeInterestRate={activeInterestRate}
                isFetchingData={isFetchingData}
              />
            )}
            {activeTab === 'withdraw' && (
              <WithdrawForm
                executeWithdraw={executeWithdraw}
                userTotalDeposits={userTotalDeposits}
                available={available}
                value={value}
                fetchedReservePrice={fetchedReservePrice}
                marketImage={marketImage}
                currentMarketId={currentMarketId}
                onCancel={onCancel}
                activeInterestRate={activeInterestRate}
                isFetchingData={isFetchingData}
              />
            )}
          </>
        )}
      </HoneyTabs>
    </div>
  );
};

export default LendSidebar;
