import React, { useState } from 'react';
import { Stack, Box, Typography, Dialog, CircularProgress } from '@mui/material';
import Image from 'next/image';
import { useWeb3React } from '@web3-react/core';
import web3 from 'web3';
import BasketballHeadABI from '../../../../lib/ABI/BasketBallHead.json';
import { MintBtn } from './styles';
import CompleteIcon from '@mui/icons-material/CheckCircleOutline';
import { confirmClaimNF3Community } from '../../../../services/api/curryshop';
import { useAppContext } from '../../../../context/AppContext';
import Link from 'next/link';
import SupplyBox from '../../SupplyBox';

type ComponentProps = {
    amountLeft: number;
    communityOwnedCount: number;
    communityClaimHexProof: any[];
    setNeedUpdateInfo: (value: boolean) => void;
};

enum MintStatus {
    NOT_MINTED,
    MINTING,
    MINT_FAILED,
    MINT_SUCCESS,
}

const NF3MintlistMintBox: React.FC<ComponentProps> = ({
    amountLeft,
    communityOwnedCount,
    communityClaimHexProof,
    setNeedUpdateInfo,
}): JSX.Element => {
    const { account, library } = useWeb3React();
    const [appState, setAppState] = useAppContext();

    const [mintState, setMintState] = useState<MintStatus>(MintStatus.NOT_MINTED);
    const [claimedCount, setclaimedCount] = useState<number>(0);

    const mint = async () => {
        if (!account) return;

        setMintState(MintStatus.MINTING);

        const nftContract = new library.eth.Contract(
            BasketballHeadABI,
            process.env.NEXT_PUBLIC_ENV == 'production'
                ? '0x75615677d9cd50cb5D9660Ffb84eCd4d333E0B76'
                : '0x22899ed83366ef867265A98413f1f332aD4Aa168'
        );

        let _mintPrice = 0.07;
        let value = (_mintPrice * communityOwnedCount).toString();
        value = web3.utils.toWei(value, 'ether');
        await nftContract.methods
            .mint(communityOwnedCount, communityClaimHexProof)
            .send({ from: account, value: value })
            .then(
                //to do : update db
                () => {
                    setclaimedCount(communityOwnedCount);
                    setMintState(MintStatus.MINT_SUCCESS);
                    setNeedUpdateInfo(true);

                    confirmClaimNF3Community(account, appState.jwtToken)
                        .then((response: any) => {
                            // console.log('resonse:', response);
                        })
                        .catch((error) => {
                            // console.log(error);
                        });
                }
            )
            .catch((e: any) => {
                setMintState(MintStatus.MINT_FAILED);
                // console.log(e);
            });
    };

    return (
        <>
            <Stack borderRadius={2} overflow="hidden" sx={{ background: '#1B1C22' }}>
                <Box position="relative" width="100%" height={{ xs: 160, md: 220 }}>
                    <Image src={'/assets/curryshop/nf3-mintlist-mint-banner.png'} layout="fill" objectFit="cover" />
                    <Stack position="absolute" justifyContent="center" alignItems="flex-start" sx={{ inset: 0 }}>
                        <SupplyBox
                            amount={amountLeft}
                            label="NF3 Basketballs Supply"
                            headColor="#FFCA21"
                            sx={{ flexGrow: 0, marginLeft: 4, paddingRight: 4 }}
                        />
                    </Stack>
                </Box>
                <Stack spacing={3} padding={{ xs: 2, md: 4 }}>
                    <Typography
                        fontSize={48}
                        fontWeight={800}
                        lineHeight={1.1}
                        textTransform="uppercase"
                        className="neueplak_condensed"
                    >
                        EARLY PURCHASE (MINTLIST)
                    </Typography>
                    <Typography>
                        Got a mintlist spot? We open up early purchasing to community partner mintlists and Discord
                        mintlist spots.
                    </Typography>
                    {/* <Stack>
                        <Typography>
                            ° FTX 2974 Holders: Enter your code{' '}
                            <Link href="/ftxholders" passHref>
                                <a rel="noopener noreferrer">
                                    <Typography color="#FFCA21" display="inline">
                                        here
                                    </Typography>
                                </a>
                            </Link>{' '}
                            to qualify for the Mintlist.
                        </Typography>
                        <Typography>° NFT Community: Mintlist spot winners will be able to claim here.</Typography>
                    </Stack> */}
                    <Stack
                        direction={{ xs: 'column', md: 'row' }}
                        alignItems={{ xs: 'flex-start', md: 'center' }}
                        spacing={4}
                        marginTop={3}
                    >
                        <Box minWidth={240} width={240} height={240} position="relative">
                            <Image
                                src={'/assets/curryshop/nf3-basketball-box.png'}
                                layout="fill"
                                style={{ borderRadius: 16 }}
                            />
                        </Box>
                        <Stack>
                            <Typography fontSize={20} fontWeight={700}>
                                NF3 BASKETBALL
                            </Typography>
                            <Typography fontSize={32} fontWeight={700} marginTop={2}>
                                PRICE: 0.07 ETH{' '}
                                <Typography fontWeight={700} display="inline">
                                    (+GAS FEE)
                                </Typography>
                            </Typography>
                            <Stack marginTop={3}>
                                <Typography fontWeight={700}>{`You have ${
                                    mintState === MintStatus.MINT_SUCCESS ? 0 : communityOwnedCount
                                } Mintlist Spots`}</Typography>
                                <MintBtn
                                    sx={{ marginTop: 1 }}
                                    disabled={mintState === MintStatus.MINT_SUCCESS || !communityOwnedCount}
                                    onClick={mint}
                                >
                                    MINT
                                </MintBtn>
                            </Stack>
                        </Stack>
                    </Stack>
                    {mintState === MintStatus.MINT_SUCCESS && (
                        <Stack
                            direction="row"
                            alignItems="center"
                            spacing={2}
                            padding={2}
                            borderRadius={1}
                            marginTop={3}
                            sx={{ background: '#FFFFFFE5' }}
                        >
                            <CompleteIcon sx={{ color: '#4CAF50' }} />
                            <Typography fontSize={14} fontWeight={500} color="#1E4620">
                                {`You have claimed ${claimedCount} NF3 Basketball, please check your `}
                                <a href="https://opensea.io/" target="_blank" style={{ color: '#2986F2' }}>
                                    Opensea
                                </a>{' '}
                                profile to check if the NF3 Basketball is in your wallet
                            </Typography>
                        </Stack>
                    )}
                </Stack>
            </Stack>
            <Dialog
                open={mintState === MintStatus.MINTING}
                maxWidth="lg"
                PaperProps={{
                    sx: {
                        padding: 4,
                        background: 'none',
                    },
                }}
            >
                <CircularProgress />
            </Dialog>
        </>
    );
};

export default NF3MintlistMintBox;
