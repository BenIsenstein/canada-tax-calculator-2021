import styled, {css} from 'styled-components'
import {ListUl} from '@styled-icons/boxicons-regular/ListUl'
import {Calendar} from '@styled-icons/boxicons-regular/Calendar'
import {NavigateNext} from '@styled-icons/material-rounded/NavigateNext'
import {NavigateBefore} from '@styled-icons/material-rounded/NavigateBefore'
import {Plus} from '@styled-icons/heroicons-solid/Plus'
import {Trash} from '@styled-icons/octicons/Trash'
import {House} from '@styled-icons/material-rounded/House'
import {Pencil} from '@styled-icons/foundation/Pencil'
import {Exit} from '@styled-icons/ionicons-outline/Exit'
import {Done} from '@styled-icons/material-rounded/Done'
import {Envelope} from '@styled-icons/boxicons-regular/Envelope'
import {PersonFill} from '@styled-icons/bootstrap/PersonFill'
import {Eye} from '@styled-icons/bootstrap/Eye'
import {EyeSlash} from '@styled-icons/bootstrap/EyeSlash'
import {Menu} from '@styled-icons/material-rounded/Menu'
import {Close} from '@styled-icons/material-rounded/Close'
import {Settings} from '@styled-icons/fluentui-system-filled/Settings'
import {Library} from '@styled-icons/fluentui-system-filled/Library'
import {FilterList} from '@styled-icons/material-rounded/FilterList'
import {HomeAdd} from '@styled-icons/fluentui-system-regular/HomeAdd'
import {RemoveCircle} from '@styled-icons/material-rounded/RemoveCircle'
import {Share} from '@styled-icons/entypo/Share'
import {DocumentToolbox} from '@styled-icons/fluentui-system-filled/DocumentToolbox'
import {Lighthouse} from '@styled-icons/simple-icons/Lighthouse'
import {HouseSiding} from '@styled-icons/material-rounded/HouseSiding'
import {Treehouse} from '@styled-icons/simple-icons/Treehouse'
import {BuildingHouse} from '@styled-icons/boxicons-solid/BuildingHouse'
import {HouseUser} from '@styled-icons/fa-solid/HouseUser'
import {Graph} from '@styled-icons/octicons/Graph'

const EyeIcon = styled(Eye)`
    height: 1.6em;
    cursor: pointer;
`

const EyeSlashIcon = styled(EyeSlash)`
    height: 1.6em;
    cursor: pointer;
`

const ListIcon = styled(ListUl)`
    height: 1.8em;
`

const PersonIcon = styled(PersonFill)`
    height: 1.6em;

    ${props => props.nav && css`
        margin-right: 1em;
    `}
`

const SettingsIcon = styled(Settings)`
    height: 1.6em;

    ${props => props.nav && css`
        margin-right: 1em;
    `}
` 

const ResourceIcon = styled(DocumentToolbox)`
    height: 1.6em;

    ${props => props.nav && css`
        margin-right: 1em;
    `}
`

const GraphIcon = styled(Graph)`
    height: 1.6em;

    ${props => props.nav && css`
        margin-right: 1em;
    `}
`

const LibraryIcon = styled(Library)`
    height: 1.6em;

    ${props => props.nav && css`
        margin-right: 1em;
    `}
`

const CalendarIcon = styled(Calendar)`
    height: 1.8em;

    ${props => props.nav && css`
        height: 1.6em;
        margin-right: 1em;
    `}
`

const NextIcon = styled(NavigateNext)`
    height: 2em;
    margin-left: auto;
    transition: transform 0.6s ease;
    fill: ${props => props.theme.prm};
`

const BackIcon = styled(NavigateBefore)`
    height: 2em;
    // margin-left: -0.8em;
    margin: 0 -.6em;
`

const AddIcon = styled(Plus)`
    height: 2em;
    margin-left: -0.5em;

    ${props => props.sm && css`
        margin: 0;
        height: 1em;
    `}
`

const HomeAddIcon = styled(HomeAdd)`
    height: 1.8em;
    margin: 0 -.5em; 
`

const FilterIcon = styled(FilterList)`
    height: 2em;
    margin-left: -.4em;
    margin-right: .1em;
`

const TrashIcon = styled(Trash)`
    height: 1em;
    // margin: 0 -0.4em;
    fill: ${props => props.theme.prm};

    ${props => props.sm && css`
        margin: 0;
        height: 1em;
    `}
`

const HouseIcon = styled(House)`
    height: 1.6em;

    ${props => props.nav && css`
        margin-right: 1em;
    `}
`

const PencilIcon = styled(Pencil)`
    height: 1.6em;
    fill: ${props => props.theme.prm};
    cursor: pointer;

    ${props => props.sm && css`
        margin: 0;
        height: 1em;
    `}
`

const ShareIcon = styled(Share)`
    height: 1.4em;
    fill: ${props => props.theme.prm};
    cursor: pointer;
    margin: 0 .6em;
`

const RemoveIcon = styled(RemoveCircle)`
    height: 1em;
    fill: ${props => props.theme.prm};
    cursor: pointer;
`

const ExitIcon = styled(Exit)`
    height: 1.6em;
    -webkit-transform: scaleX(-1);
    transform: scaleX(-1);

    ${props => props.nav && css`
        margin-right: 1em;
    `}
`

const CheckIcon = styled(Done)`
    height: 1.8em;
    fill: ${props => props.theme.prm};
    cursor: pointer;
`

const EnvelopeIcon = styled(Envelope)`
    height: 2em;
    fill: ${props => props.theme.prm};
    cursor: pointer;
`

const MenuIcon = styled(Menu)`
    height: 2em;
    fill: ${props => props.theme.prm};
    cursor: pointer;
`

const CloseIcon = styled(Close)`
    height: 2em;
    fill: white;
    cursor: pointer;
`

const LighthouseIcon = styled(Lighthouse)`
    height: 2em;
    fill: white;
    cursor: pointer;
` 
const HouseSidingIcon = styled(HouseSiding)`
    height: 2em;
    fill: white;
    cursor: pointer;
`

const TreehouseIcon = styled(Treehouse)`
    height: 2em;
    fill: white;
    cursor: pointer;
`

const BuildingHouseIcon = styled(BuildingHouse)`
    height: 2em;
    fill: white;
    cursor: pointer;
`
const HouseUserIcon = styled(HouseUser)`
    height: 2em;
    fill: white;
    cursor: pointer;  
`

export {EyeIcon, EyeSlashIcon, ListIcon, PersonIcon, SettingsIcon, ResourceIcon, LibraryIcon, CalendarIcon, NextIcon, BackIcon, AddIcon, HomeAddIcon, FilterIcon, TrashIcon, HouseIcon, PencilIcon, ShareIcon, RemoveIcon, ExitIcon, CheckIcon, EnvelopeIcon, MenuIcon, CloseIcon, TreehouseIcon, BuildingHouseIcon, HouseSidingIcon, LighthouseIcon, HouseUserIcon, GraphIcon }