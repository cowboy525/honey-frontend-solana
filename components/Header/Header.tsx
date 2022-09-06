import * as styles from './Header.css';
import { FC } from 'react';
import { Button, Space, Typography } from 'antd';
import HeaderStats from 'components/HeaderStats/HeaderStats';
import HeaderDropdownMenu from 'components/HeaderDropdownMenu/HeaderDropdownMenu';
import WalletMenu from 'components/WalletMenu/WalletMenu';
import { WalletIcon } from 'icons/WalletIcon';
import HoneyCardYellowShadow from '../HoneyCardYellowShadow/HoneyCardYellowShadow';

const Header: FC = () => {
  const wallet = true;
  return (
    <div className={styles.headerContainer}>
      <HoneyCardYellowShadow>
        <Space className={styles.content}>
          <div className={styles.leftContainer}>
            <div className={styles.logo} />
            <HeaderDropdownMenu />
          </div>

          <HeaderStats />

          {wallet ? (
            <WalletMenu />
          ) : (
            <Button
              shape="round"
              type="primary"
              icon={<WalletIcon />}
              className={styles.walletBtn}
            >
              <Typography.Text>CONNECT WALLET</Typography.Text>
            </Button>
          )}
        </Space>
      </HoneyCardYellowShadow>
    </div>
  );
};

export default Header;
