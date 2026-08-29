import CurrencyExchangeOutlinedIcon from '@mui/icons-material/CurrencyExchangeOutlined';
import clsx from 'clsx';
import { useCurrency } from '../../context/CurrencyContext';
import DropdownPill from './DropdownPill';
import { ICON_BUTTON } from '../layout/navStyles';

export default function CurrencySelector({ className = '', iconOnly = false }) {
  const { code, setCode, currencies } = useCurrency();
  const active = currencies.find((c) => c.code === code);

  return (
    <div className={className}>
      <DropdownPill
        ariaLabel="Currency"
        activeCode={code}
        onSelect={setCode}
        icon={<CurrencyExchangeOutlinedIcon fontSize="small" />}
        label={
          iconOnly ? null : (
            <>
              {active?.symbol} <span className="hidden sm:inline">{code}</span>
            </>
          )
        }
        showChevron={!iconOnly}
        triggerClassName={iconOnly ? clsx('flex items-center justify-center', ICON_BUTTON) : undefined}
        options={currencies.map((c) => ({ code: c.code, display: `${c.symbol} ${c.code}` }))}
      />
    </div>
  );
}
