'use client';

import { useGetAccounts } from '@/features/accounts/api/useGetAccounts';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import qs from 'query-string';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import useGetSummary from '@/features/summary/api/useGetSummary';

export const AccountFilter = () => {
  const { data: accounts, isLoading: isLoadingAccounts } = useGetAccounts();
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const {  data: summaryData, isLoading: isSummaryLoading } = useGetSummary()

  const accountId = params.get("accountId") || 'all';

  const from = params.get("from") || "";
  const to = params.get("to") || "";

  const onChange = (newValue: string) => {
    const query = {
      accountId: newValue,
      from,
      to,
    }

    if(newValue === 'all') {
      query.accountId = ''
    };

    const url = qs.stringifyUrl({
      url: pathname,
      query,
    }, { skipEmptyString: true, skipNull: true });

    router.push(url);

  }

  if(isLoadingAccounts) return null;
  
  return (
    <Select value={accountId} onValueChange={onChange} disabled={isSummaryLoading || isLoadingAccounts}>
      <SelectTrigger className="lg:w-auto w-full h-9 rounded-md px-3 font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus:ring-offset-0 focus:ring-transparent outline-none text-white focus:bg-white/30 trasition">
        <SelectValue placeholder="Account" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Filter Account</SelectLabel>
          <SelectItem value="all">All accounts</SelectItem>
          {accounts?.map((account) => (
            <SelectItem key={account.id} value={account.id.toString()}>
              {account.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
