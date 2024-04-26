"use client"
import React, { useEffect, useState } from 'react'
import MBreadcrumb from '@/app/components/config/MBreadcrumb'
import HomeLayout from '@/app/layouts/HomeLayout'
import { Button, Collapse } from 'antd'
import './style.css'
import ManyResult from './questions/ManyResult'
import TrueFalse from './questions/TrueFalse'
import Connect from './questions/Connect'
import Explain from './questions/Explain'
import Coding from './questions/Coding'
import FillBlank from './questions/FillBlank'
import Random from './questions/Random'
import Pause from '@/app/components/icons/pause-circle.svg'
import Edit from '@/app/components/icons/edit-2.svg'
import Play from '@/app/components/icons/video-circle.svg'
import Close from '@/app/components/icons/close-circle2.svg'

export default function Result({ params }: any) {

    return (
        <HomeLayout>
            <MBreadcrumb
                items={[
                    { text: "Danh sách đợt thi", href: "/" },
                    {
                        href: `/`,
                        text: `Kết quả đợt thi`,
                    },
                    {
                        href: `/`,
                        text: `Tên gì gì đó`,
                        active: true,
                    },
                ]}
            />
            <div className="body_semibold_20 mt-3 w-full flex  justify-between items-center pb-4">
                <div className="">Chi tiết bài làm</div>
            </div>
            <div className="grid grid-cols-3">
                <div className="col-span-2 mr-2">
                    <Collapse
                        defaultActiveKey={["1"]}
                        // defaultActiveKey={defaultActiveKeys}
                        key={""}
                        ghost
                        expandIconPosition="end"
                        className="mb-5 rounded-lg bg-white overflow-hidden arrow"
                    >
                        <div className='px-4 bg-m_warning_50 text-m_warnig_title py-2 font-semibold text-base'>Có 1 câu hỏi tự luận cần chấm điểm</div>
                        <Collapse.Panel
                            key="1"
                            header={
                                <div>
                                    <div className="my-3 flex justify-between items-center">
                                        <div className=''>
                                            <div className="text-base font-semibold">Phần</div>
                                        </div>
                                        <Button className='w-[163px] h-[36px] bg-m_primary_500 rounded-lg font-semibold text-sm text-white'>Câu hỏi tự luận</Button>
                                    </div>
                                </div>
                            }
                        >
                            <ManyResult />
                            <TrueFalse />
                            <Connect />
                            <Explain />
                            <Coding />
                            <FillBlank />
                            <Random />
                        </Collapse.Panel>
                    </Collapse>
                </div>
                <div className="col-span-1 h-fit ml-2">
                    <div className='bg-white rounded-lg'>
                        <div className='flex justify-between items-center p-4'>
                            <div className='font-bold text-base text-m_primary_500'>Tên gì gì đó</div>
                            <div className='bg-m_success_50 px-4 py-1 flex'>
                                <div className='font-bold text-base text-m_success_600'>8</div>
                                <div className='text-m_success_600'>/10đ</div>
                            </div>
                        </div>
                        <hr />
                        <div className='p-4'>
                            <div className='flex justify-between items-center pb-2'>
                                <div className='text-sm'>Mốc đạt:</div>
                                <div className='font-semibold'>80%</div>
                            </div>
                            <div className='flex justify-between items-center pb-2'>
                                <div className='text-sm'>Phần trăm hoàn thành đúng</div>
                                <div className='font-semibold'>80%</div>
                            </div>
                            <div className='flex justify-between items-center pb-2'>
                                <div className='text-sm'>Số câu đúng (chưa tính câu tự luận)</div>
                                <div className='font-semibold'>8/9</div>
                            </div>
                            <div className='flex justify-between items-center pb-2'>
                                <div className='text-sm'>Số lượng câu tự luận</div>
                                <div className='font-semibold'>1</div>
                            </div>
                            <div className='flex justify-between items-center pb-2'>
                                <div className='text-sm'>Thời gian làm bài</div>
                                <div className='font-semibold'>00:30:15</div>
                            </div>
                        </div>
                    </div>
                    <div className='bg-white rounded-lg mt-4'>
                        <div className='p-4'>
                            <div className='font-bold text-base'>Timeline chi tiết</div>
                        </div>
                        <hr />
                        <div className='p-4'>
                            {/* <div className='pb-4'>
                                <div className='flex items-center'>
                                    <Play />
                                    <div className='font-semibold pl-1'>Bắt đầu làm bài</div>
                                </div>
                                <div className='text-sm text-m_neutral_500 pl-5'>13/04/2024 11:14:19</div>
                            </div>
                            <div className='pb-4'>
                                <div className='flex items-center'>
                                    <Edit />
                                    <div className='font-semibold pl-1'>Bắt đầu làm câu hỏi số 1</div>
                                </div>
                                <div className='text-sm text-m_neutral_500 pl-5'>13/04/2024 11:14:19</div>
                            </div>
                            <div className='pb-4'>
                                <div className='flex items-center'>
                                    <Edit />
                                    <div className='font-semibold pl-1'>Bắt đầu làm câu hỏi số 2</div>
                                </div>
                                <div className='text-sm text-m_neutral_500 pl-5'>13/04/2024 11:14:19</div>
                            </div>
                            <div className='pb-4'>
                                <div className='flex items-center'>
                                    <Close />
                                    <div className='font-semibold pl-1'>Thoát ra ngoài màn hình lần 1</div>
                                </div>
                                <div className='text-sm text-m_neutral_500 pl-5'>13/04/2024 11:14:19</div>
                            </div>
                            <div className='pb-4'>
                                <div className='flex items-center'>
                                    <Edit />
                                    <div className='font-semibold pl-1'>Bắt đầu làm câu hỏi số 4</div>
                                </div>
                                <div className='text-sm text-m_neutral_500 pl-5'>13/04/2024 11:14:19</div>
                            </div>
                            <div className='pb-4'>
                                <div className='flex items-center'>
                                    <Pause />
                                    <div className='font-semibold pl-1'>Nộp bài thi</div>
                                </div>
                                <div className='text-sm text-m_neutral_500 pl-5'>13/04/2024 11:14:19</div>
                            </div> */}
                            <div className='flex-row'>
                                <div className='flex'>
                                    <div className='pt-[6px] mr-5'>
                                        <div className='w-3 h-3 bg-m_primary_500 rounded-full mb-1' />
                                        <div className='h-10 ml-[5px] border-dotted border-l-2 border-m_neutral_300' />
                                    </div>
                                    <div>
                                        <div className='pb-4'>
                                            <div className='flex items-center'>
                                                <Play />
                                                <div className='font-semibold pl-1'>Bắt đầu làm bài</div>
                                            </div>
                                            <div className='text-sm text-m_neutral_500 pl-5'>13/04/2024 11:14:19</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='flex-row'>
                                <div className='flex'>
                                    <div className='pt-[6px] mr-5'>
                                        <div className='w-3 h-3 bg-m_primary_500 rounded-full mb-1' />
                                        <div className='h-10 ml-[5px] border-dotted border-l-2 border-m_neutral_300' />
                                    </div>
                                    <div>
                                        <div className='pb-4'>
                                            <div className='flex items-center'>
                                                <Edit />
                                                <div className='font-semibold pl-1'>Bắt đầu làm câu hỏi số 1</div>
                                            </div>
                                            <div className='text-sm text-m_neutral_500 pl-5'>13/04/2024 11:14:19</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='flex-row'>
                                <div className='flex'>
                                    <div className='pt-[6px] mr-5'>
                                        <div className='w-3 h-3 bg-m_primary_500 rounded-full mb-1' />
                                        <div className='h-10 ml-[5px] border-dotted border-l-2 border-m_neutral_300' />
                                    </div>
                                    <div>
                                        <div className='pb-4'>
                                            <div className='flex items-center'>
                                                <Close />
                                                <div className='font-semibold pl-1'>Thoát ra ngoài màn hình lần 1</div>
                                            </div>
                                            <div className='text-sm text-m_neutral_500 pl-5'>13/04/2024 11:14:19</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='flex-row'>
                                <div className='flex'>
                                    <div className='pt-[6px] mr-5'>
                                        <div className='w-3 h-3 bg-m_primary_500 rounded-full mb-1' />
                                        {/* <div className='h-10 ml-[5px] border-dotted border-l-2 border-m_neutral_300' /> */}
                                    </div>
                                    <div>
                                        <div className='pb-4'>
                                            <div className='flex items-center'>
                                                <Pause />
                                                <div className='font-semibold pl-1'>Nộp bài thi</div>
                                            </div>
                                            <div className='text-sm text-m_neutral_500 pl-5'>13/04/2024 11:14:19</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </HomeLayout>
    )
}
