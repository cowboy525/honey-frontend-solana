import type { NextPage } from 'next';
import React, { useState, useEffect } from 'react';
import { Box, Stack, Button, IconChevronLeft, Text, Avatar } from 'degen';
import Layout from '../../../components/Layout/Layout';
import * as styles from '../../../styles/liquidation.css';

interface LiquidationSubProps {
  loan: any;
}

const LiquidationSub = (props: LiquidationSubProps) => {
  const { loan } = props;

  console.log('loan', loan)

  return (
    <Box className={styles.subWrapper}>
      {
        loan && (
          <Box className={styles.subContainer}>
            <Box className={styles.imageWrapper}>
              <Avatar
                label="" size="15" src={loan.image}
              />
              <Text>{loan.title}</Text>
            </Box>
            <Text>{loan.debt}</Text>
            <Text>{loan.collateral}</Text>
            <Text>{loan.address}</Text>
            <Text>{loan.lr}</Text>
            <Text>{loan.ltv}</Text>
            <Text>Borrow</Text>
            {/* <Button variant="primary">Borrow</Button> */}
          </Box>
        )
      }
    </Box>
  );
};

export default LiquidationSub;