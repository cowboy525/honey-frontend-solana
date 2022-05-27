import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useWalletKit } from '@gokiprotocol/walletkit';
import { useConnectedWallet } from '@saberhq/use-solana';
import { Box, Text, Card, IconPlus } from 'degen';
import { Stack, IconSearch, Input } from 'degen';
import ToggleSwitch from '../../components/ToggleSwitch';
import AssetRow, { AssetRowType } from '../../components/AssetRow';
import Layout from '../../components/Layout/Layout';
import * as styles from '../../styles/loan.css';
import LoanHeaderComponent from 'components/LoanHeaderComponent/LoanHeaderComponent';
import CreateMarket from 'pages/createmarket';
import  { ConfigureSDK } from '../../helpers/loanHelpers';
import { useMarket, useBorrowPositions } from '@honey-finance/sdk';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import {TYPE_ZERO, TYPE_ONE} from '../../constants/loan';

// TODO: should be fetched by SDK
const assetData: Array<AssetRowType> = [
  {
    vaultName: 'Cofre',
    vaultImageUrl: 'https://www.arweave.net/5zeisOPbDekgyqYHd0okraQKaWwlVxvIIiXLH4Sr2M8?ext=png',
    totalBorrowed: 14000,
    interest: 10,
    available: 1000,
    positions: 0
  }
];

const Loan: NextPage = () => {
  const wallet = useConnectedWallet();
  const { connect } = useWalletKit();
  const sdkConfig = ConfigureSDK();

  const [userLoans, setUserLoans] = useState(0);
  const [userDeposits, setUserDeposits] = useState('');
  const [userCollateral, setUserCollateral] = useState('');

  /**
     * @description calls upon the honey sdk - market 
     * @params solanas useConnection func. && useConnectedWallet func. && JET ID
     * @returns honeyUser which is the main object - honeyMarket, honeyReserves are for testing purposes
    */
  const { honeyClient, honeyUser } = useMarket(sdkConfig.saberHqConnection, sdkConfig.sdkWallet!, sdkConfig.honeyId, sdkConfig.marketId);
  
  useEffect(() => {
    console.log('this is honeyUser', honeyUser?.loans())
    if (honeyUser?.loans().length) {
      honeyUser?.loans().map(value => {
        let honeyUserLoan: any = value.amount.toString();
        let sum = honeyUserLoan / LAMPORTS_PER_SOL;
        console.log('@@@@@@@USER_LOANS@@@@@@', sum);
        setUserLoans(sum);
      })
    }

    if(honeyUser?.deposits().length) {
      honeyUser?.deposits().map(value => {
        console.log('honeyUser deposits', value.amount.toString());
        let honeyUserDeposit = value.amount.toString();
        setUserDeposits(honeyUserDeposit);
      })
    }

    if(honeyUser?.collateral().length) {
      honeyUser?.collateral().map(value => {
        console.log('honeyUser collateral', value.amount.toString());
        let honeyUserCollateral = value.amount.toString();
        setUserCollateral(honeyUserCollateral);
      })
    }

  }, [honeyClient, honeyUser]);
  
  /**
   * @description state to update open positions
   * @params none
   * @returns currentOpenPositions
  */
  const [currentOpenPositions, setCurrentOpenPositions] = useState(TYPE_ZERO);
  /**
   * @description fetches open positions and the amount regarding loan positions / token account
   * @params none
   * @returns collateralNFTPositions | loading | error
  */  
  let { loading, collateralNFTPositions, error } = useBorrowPositions(sdkConfig.saberHqConnection, sdkConfig.sdkWallet!, sdkConfig.honeyId, sdkConfig.marketId)
  /**
   * @description sets open positions
   * @params none
   * @returns collateralNFTPositions
  */
  useEffect(() => {
    console.log('collateralpositions', collateralNFTPositions?.length)
    if (collateralNFTPositions) setCurrentOpenPositions(collateralNFTPositions.length);
  }, [collateralNFTPositions]);

  /**
     * @description **dont call - actually creates a market
     * @params **dont call - actually creates a market
     * @returns **dont call - actually creates a market
    */
  function createMarket() {
    // if (honeyClient && wallet?.publicKey) {
    //   honeyClient.createMarket({
    //     owner: wallet.publicKey,
    //     quoteCurrencyMint: new PublicKey('So11111111111111111111111111111111111111112'),
    //     quoteCurrencyName: 'wSOL',
    //     nftCollectionCreator: new PublicKey('F69tu2rGcBrTtUT2ZsevujKRP4efVs9VfZPK2hYbYhvi'),
    //     nftOraclePrice: new PublicKey('FNu14oQiSkLFw5iR5Nhc4dTkHqJH5thg1CRVQkwx66LZ'),
    //     nftOracleProduct: new PublicKey('FNu14oQiSkLFw5iR5Nhc4dTkHqJH5thg1CRVQkwx66LZ')
    //   });
    // }
    return;
  }

  /**
   * @description logic for rendering borrow or lend page 
   * @params 0 | 1
   * @returns state for rendering correct modal
  */
  const [borrowOrLend, setBorrowOrLend] = useState(TYPE_ZERO);
  const loadBorrowPage = wallet && borrowOrLend === TYPE_ZERO;
  const loadLendPage = wallet && borrowOrLend === TYPE_ONE;
  
  /**
   * @description logic for rendering out create market page
   * @params 0 | 1
   * @returns create market modal or Pool modal in return of Loan component
  */
  const [renderCreateMarket, setRenderCreateMarket] = useState(TYPE_ZERO);
  
  useEffect(() => {
  }, [renderCreateMarket]);
  
  function handleCreateMarket() {
    setRenderCreateMarket(TYPE_ONE);
  }

  return (
    <Layout>
      <Stack>
        <Box marginY="4">
          <Stack direction="vertical" space="5">
            <Stack
              direction="horizontal"
              align="center"
              justify="space-between"
            >
              <ToggleSwitch
                buttons={[
                  {
                    title: 'Borrow',
                    onClick: () => setBorrowOrLend(TYPE_ZERO)
                  },
                  { title: 'Lend', onClick: () => setBorrowOrLend(TYPE_ONE) }
                ]}
                activeIndex={borrowOrLend}
              />
              <LoanHeaderComponent
                handleCreateMarket={handleCreateMarket}
                openPositions={currentOpenPositions}
              />
            </Stack>
          </Stack>
        </Box>
        <Box
            backgroundColor="backgroundTertiary"
            minWidth="full"
            gap="3"
            borderRadius="2xLarge"
            padding="5"
            width="full"
          >
            <Stack>
        {
          renderCreateMarket == 1 
          ?
            <CreateMarket
              setRenderCreateMarket={setRenderCreateMarket}
              createMarket={createMarket}
            />
          :

            <Stack>
              <Box className={styles.cardMenuContainer}>
                <Box padding="1">
                  <Input
                    label=""
                    placeholder="Search by name"
                    prefix={<IconSearch />}
                  />
                </Box>
                <Text>Total borrowed</Text>
                <Text>Interest</Text>
                <Text>Available</Text>
                <Text>Your positions</Text>
              </Box>
              <Box>
                <hr className={styles.lineDivider}></hr>
              </Box>
              <Stack>
                <Box>
                  {assetData.map(item => (
                    <Box key={item.vaultName}>
                      {loadBorrowPage && (
                        <Link href="/loan/[name]" as={`/loan/${item.vaultName}`}>
                          <a>
                            <AssetRow
                              data={item}
                              openPositions={currentOpenPositions}
                            />
                          </a>
                        </Link>
                      )}
                      {loadLendPage && (
                        <Link
                          href="/loan/lend/[name]"
                          as={`/loan/lend/${item.vaultName}`}
                        >
                          <a>
                            <AssetRow 
                              data={item}
                              openPositions={currentOpenPositions}
                            />
                          </a>
                        </Link>
                      )}
                      {!wallet && (
                        <Box onClick={connect} cursor="pointer">
                          <AssetRow 
                            data={item} 
                            openPositions={currentOpenPositions}
                          />
                        </Box>
                      )}
                    </Box>
                  ))}
                </Box>
              </Stack>
            </Stack>
          }
          </Stack>
        </Box>
      </Stack>
    </Layout>
  );
};

export default Loan;
