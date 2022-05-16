import React, { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import BasketballHeadABI from '../../../lib/ABI/BasketBallHead.json';
import Image from 'next/image';
import { AmountInputWrapper, AmountInputTextField, MaxBtn, MintBtn, ReserveBtn } from '../styles';

type ComponentProps = {
    amountLeft: number;
    disabled?: boolean;
};

const MAX_VAL = 3;

const GeneralMintBox: React.FC<ComponentProps> = ({ amountLeft, disabled = false }): JSX.Element => {
    const { active, account, library, activate } = useWeb3React();
    const [mintAmount, setMintAmount] = useState<string>('');
    const [mintPrice, setMintPrice] = useState<number>(0);
    const [reservedAmount, setReservedAmount] = useState<string>('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (!isNaN(Number(value)) && Number(value) <= MAX_VAL) setMintAmount(value);
    };

    const mint = async () => {
        if (!account) return;

        const nftContract = new library.eth.Contract(
            BasketballHeadABI,
            process.env.NEXT_PUBLIC_ENV == 'production'
                ? '0xC57C94346b466bED19438c195ad78CAdC7D09473'
                : '0xb627Cd8E908EDfde1494304168AF6f59ADcB410E'
        );

        try {
            let reservedCount = await nftContract.methods.reserveCount(account).call({ from: account });
            if (parseInt(reservedCount)) {
                await nftContract.methods.mint(mintAmount, []).send({ from: account, value: 0 });
                reservedCount = await nftContract.methods.reserveCount(account).call({ from: account });
                setReservedAmount(reservedCount);
            } else {
                await nftContract.methods
                    .mint(mintAmount, [])
                    .send({ from: account, value: mintPrice * parseInt(mintAmount) });
            }
        } catch (err: any) {
            console.error(err);
            return;
        }
    };

    const reserve = async () => {
        if (!account) return;

        const nftContract = new library.eth.Contract(
            BasketballHeadABI,
            process.env.NEXT_PUBLIC_ENV == 'production'
                ? '0xC57C94346b466bED19438c195ad78CAdC7D09473'
                : '0xb627Cd8E908EDfde1494304168AF6f59ADcB410E'
        );

        try {
            let dropPhase = await nftContract.methods.dropPhase().call({ from: account });
            if (parseInt(dropPhase) == 3) {
                await nftContract.methods
                    .reserve(mintAmount)
                    .send({ from: account, value: mintPrice * parseInt(mintAmount) });
                const reservedCount = await nftContract.methods.reserveCount(account).call({ from: account });
                setReservedAmount(reservedCount);
            }
        } catch (err: any) {
            console.error(err);
            return;
        }
    };

    React.useEffect(() => {
        async function updateAppState() {
            const nftContract = new library.eth.Contract(
                BasketballHeadABI,
                process.env.NEXT_PUBLIC_ENV == 'production'
                    ? '0xC57C94346b466bED19438c195ad78CAdC7D09473'
                    : '0xb627Cd8E908EDfde1494304168AF6f59ADcB410E'
            );

            const reservedCount = await nftContract.methods.reserveCount(account).call({ from: account });
            console.log(reservedCount);
            const mPrice = await nftContract.methods.mintprice().call({ from: account });
            setReservedAmount(reservedCount);
            setMintPrice(parseInt(mPrice));
        }
        if (account) {
            updateAppState();
        }
    }, [account]);

    return (
        <Stack padding={4} borderRadius={2} sx={{ background: '#1B1C22' }}>
            <Typography fontSize={48} fontWeight={700}>
                General Mint
            </Typography>
            <Typography fontWeight={700} marginTop={2}>
                Free NF3 Basketball Mint for every GCF NFT Holders
            </Typography>
            <Stack direction="row" spacing={2} marginTop={3}>
                <Image
                    src={'/assets/currycounter/curry-brand.png'}
                    width={160}
                    height={160}
                    style={{ borderRadius: 16 }}
                />
                <Stack>
                    <Typography fontWeight={700}>How it works:</Typography>
                    <Typography marginTop={2}>° A snapshot will be taken on XXX, 2022 at 5PM PST</Typography>
                    <Typography>
                        ° On XXX, 2022 at 5PM PST, you may mint an NF3 Basketball for every GCF you hold
                    </Typography>
                    <Typography>
                        ° Please Note: You will need enough Ethereum in your wallet to pay for the gas fee.
                    </Typography>
                </Stack>
            </Stack>
            <Typography fontSize={32} fontWeight={700} marginTop={4}>
                PRICE: 0.07{' '}
                <Typography fontWeight={700} display="inline">
                    (+GAS FEE)
                </Typography>
            </Typography>
            <Stack spacing={1} marginTop={3}>
                <Typography fontSize={14} fontWeight={400} color="white">
                    # of Basketball Heads (Max 3)
                </Typography>
                <AmountInputWrapper sx={{ width: 184 }}>
                    <AmountInputTextField value={mintAmount} onChange={handleInputChange} />
                    <MaxBtn onClick={() => setMintAmount(MAX_VAL.toString())}>Max</MaxBtn>
                </AmountInputWrapper>
            </Stack>
            <Stack spacing={1} marginTop={2}>
                <Typography fontWeight={700} color="white">
                    {disabled ? 'Currently Unavailable' : 'You have ' + reservedAmount + ' reserve mints'}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <MintBtn disabled={disabled} onClick={mint}>
                            MINT
                        </MintBtn>
                        <ReserveBtn disabled={disabled} onClick={reserve}>
                            RESERVE
                        </ReserveBtn>
                    </Stack>
                </Stack>
            </Stack>
        </Stack>
    );
};

export default GeneralMintBox;